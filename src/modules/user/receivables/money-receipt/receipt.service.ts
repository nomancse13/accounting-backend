import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Pagination,
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';
import { Brackets } from 'typeorm';
import { CustomersService } from '../customers/customers.service';
import { decrypt } from 'src/helper/crypto.helper';
import { ReceiptEntity } from './entity';
import { CreateReceiptDto, UpdateReceiptDto } from './dtos';
import { AccountService } from '../../account/account.service';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private receiptRepository: BaseRepository<ReceiptEntity>,
    private readonly customersService: CustomersService,
    private readonly accountService: AccountService,
  ) {}

  //  create Receipt
  async createReceipt(
    createReceiptDto: CreateReceiptDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const customerInfo = await this.customersService.findOneCustomer(
        createReceiptDto.customerId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        createReceiptDto.accountId,
      );

      createReceiptDto['createdBy'] = userPayload.id;

      const insertData = await this.receiptRepository.save(createReceiptDto);

      insertData.customer = customerInfo;
      insertData.account = accountInfo;

      const saveReceipt = await this.receiptRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveReceipt;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update Receipt
  async updateReceipt(
    updateReceiptDto: UpdateReceiptDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateReceiptDto['updatedAt'] = new Date();
      updateReceiptDto['updatedBy'] = userPayload.id;

      const customerInfo = await this.customersService.findOneCustomer(
        updateReceiptDto.customerId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        updateReceiptDto.accountId,
      );

      delete updateReceiptDto.customerId;
      delete updateReceiptDto.accountId;

      const receiptData = await this.receiptRepository
        .createQueryBuilder()
        .update(ReceiptEntity, updateReceiptDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.receiptRepository
        .createQueryBuilder('receipt')
        .where(`receipt.id = ${id}`)
        .getOne();

      dataFind.customer = customerInfo;
      dataFind.account = accountInfo;

      await this.receiptRepository.save(dataFind);

      return `receipt Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all receipt Data
  async findAllReceiptData(
    listQueryParam: PaginationOptionsInterface,
    filter: any,
    userPayload: UserInterface,
  ) {
    const limit: number = listQueryParam.limit ? listQueryParam.limit : 10;
    const page: number = listQueryParam.page
      ? +listQueryParam.page == 1
        ? 0
        : listQueryParam.page
      : 1;

    const [results, total] = await this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.customer', 'customer')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`receipt.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('receipt.id', 'DESC')
      .take(limit)
      .skip(page > 0 ? page * limit - limit : page)
      .getManyAndCount();

    return new Pagination<any>({
      results,
      total,
      currentPage: page === 0 ? 1 : page,
      limit,
    });
  }

  // delete receipt
  async deleteReceipt(id: number): Promise<any> {
    try {
      const receiptData = await this.receiptRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!receiptData) {
        throw new NotFoundException('receipt not found');
      }

      return await this.receiptRepository.remove(receiptData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One receipt
   */
  async findOneReceiptData(id: number) {
    const data = await this.receiptRepository.findOne({
      where: {
        id: id,
      },
      relations: ['customer'],
    });
    if (!data) {
      throw new NotFoundException(`receipt not exist in db!!`);
    }
    return data;
  }
}

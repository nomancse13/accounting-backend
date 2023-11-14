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
import { SaleVoucherEntity } from './entity';
import { CustomersService } from '../customers/customers.service';
import { CreateSaleVoucherDto, UpdateSaleVoucherDto } from './dtos';
import { decrypt } from 'src/helper/crypto.helper';

@Injectable()
export class SaleVoucherService {
  constructor(
    @InjectRepository(SaleVoucherEntity)
    private saleVoucherRepository: BaseRepository<SaleVoucherEntity>,
    private readonly customersService: CustomersService,
  ) {}

  //  create sale Voucher
  async createSaleVoucher(
    createSaleVoucherDto: CreateSaleVoucherDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const customerInfo = await this.customersService.findOneCustomer(
        createSaleVoucherDto.customerId,
      );

      createSaleVoucherDto['createdBy'] = userPayload.id;

      const insertData =
        await this.saleVoucherRepository.save(createSaleVoucherDto);

      insertData.customer = customerInfo;

      const saveSaleVoucher = await this.saleVoucherRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveSaleVoucher;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update sale Voucher
  async updateSaleVoucher(
    updateSaleVoucherDto: UpdateSaleVoucherDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateSaleVoucherDto['updatedAt'] = new Date();
      updateSaleVoucherDto['updatedBy'] = userPayload.id;

      const customerInfo = await this.customersService.findOneCustomer(
        updateSaleVoucherDto.customerId,
      );

      delete updateSaleVoucherDto.customerId;

      const saleVoucherData = await this.saleVoucherRepository
        .createQueryBuilder()
        .update(SaleVoucherEntity, updateSaleVoucherDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.saleVoucherRepository
        .createQueryBuilder('sale')
        .where(`sale.id = ${id}`)
        .getOne();

      dataFind.customer = customerInfo;

      await this.saleVoucherRepository.save(dataFind);

      return `sale Voucher Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all sale Voucher Data
  async findAllVoucherData(
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

    const [results, total] = await this.saleVoucherRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`sale.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('sale.id', 'DESC')
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

  // delete sale
  async deleteSale(id: number): Promise<any> {
    try {
      const voucherData = await this.saleVoucherRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!voucherData) {
        throw new NotFoundException('voucherData not found');
      }

      return await this.saleVoucherRepository.remove(voucherData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One voucherData
   */
  async findOneVoucherData(id: number) {
    const data = await this.saleVoucherRepository.findOne({
      where: {
        id: id,
      },
      relations: ['customer'],
    });
    if (!data) {
      throw new NotFoundException(`voucher not exist in db!!`);
    }
    return data;
  }
}

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
import { decrypt } from 'src/helper/crypto.helper';
import { SuppliersService } from '../supplier/suppliers.service';
import { PurchaseVoucherEntity } from './entity';
import { CreatePurchaseVoucherDto, UpdatePurchaseVoucherDto } from './dtos';
import { AccountService } from '../../account/account.service';

@Injectable()
export class PurchaseVoucherService {
  constructor(
    @InjectRepository(PurchaseVoucherEntity)
    private purchaseVoucherRepository: BaseRepository<PurchaseVoucherEntity>,
    private readonly suppliersService: SuppliersService,
    private readonly accountService: AccountService,
  ) {}

  //  create purchase voucher
  async createPurchaseVoucher(
    createPurchaseVoucherDto: CreatePurchaseVoucherDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const supplierInfo = await this.suppliersService.findOneSupplier(
        createPurchaseVoucherDto.supplierId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        createPurchaseVoucherDto.accountId,
      );

      createPurchaseVoucherDto['createdBy'] = userPayload.id;

      delete createPurchaseVoucherDto.supplierId;
      delete createPurchaseVoucherDto.accountId;
      const insertData = await this.purchaseVoucherRepository.save(
        createPurchaseVoucherDto,
      );

      insertData.supplier = supplierInfo;
      insertData.account = accountInfo;

      const savePurchaseVoucher =
        await this.purchaseVoucherRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return savePurchaseVoucher;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update purchase Voucher
  async updatePurchaseVoucher(
    updatePurchaseVoucherDto: UpdatePurchaseVoucherDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updatePurchaseVoucherDto['updatedAt'] = new Date();
      updatePurchaseVoucherDto['updatedBy'] = userPayload.id;

      const supplierInfo = await this.suppliersService.findOneSupplier(
        updatePurchaseVoucherDto.supplierId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        updatePurchaseVoucherDto.accountId,
      );

      delete updatePurchaseVoucherDto.supplierId;
      delete updatePurchaseVoucherDto.accountId;

      const purchaseVoucherData = await this.purchaseVoucherRepository
        .createQueryBuilder()
        .update(PurchaseVoucherEntity, updatePurchaseVoucherDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.purchaseVoucherRepository
        .createQueryBuilder('purchasevoucher')
        .where(`purchasevoucher.id = ${id}`)
        .getOne();

      dataFind.supplier = supplierInfo;
      dataFind.account = accountInfo;
      await this.purchaseVoucherRepository.save(dataFind);

      return `purchase Voucher Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all purchase Voucher Data
  async findAllPurchaseVoucherData(
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

    const [results, total] = await this.purchaseVoucherRepository
      .createQueryBuilder('purchasevoucher')
      .leftJoinAndSelect('purchasevoucher.supplier', 'supplier')
      .leftJoinAndSelect('purchasevoucher.account', 'account')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`purchasevoucher.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('purchasevoucher.id', 'DESC')
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

  // delete purchase voucher
  async deletePurchaseVoucher(id: number): Promise<any> {
    try {
      const purchaseVoucherData = await this.purchaseVoucherRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!purchaseVoucherData) {
        throw new NotFoundException('purchaseVoucherData not found');
      }

      return await this.purchaseVoucherRepository.remove(purchaseVoucherData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One purchase voucher
   */
  async findOnePurchaseVoucherData(id: number) {
    const data = await this.purchaseVoucherRepository.findOne({
      where: {
        id: id,
      },
      relations: ['account'],
    });
    if (!data) {
      throw new NotFoundException(`purchase voucher not exist in db!!`);
    }
    return data;
  }
}

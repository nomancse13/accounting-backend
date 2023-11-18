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
import { AccountService } from '../../account/account.service';
import { PaymentVoucherEntity } from './entity';
import { CreatePaymentVoucherDto, UpdatePaymentVoucherDto } from './dtos';

@Injectable()
export class PaymentVoucherService {
  constructor(
    @InjectRepository(PaymentVoucherEntity)
    private paymentVoucherRepository: BaseRepository<PaymentVoucherEntity>,
    private readonly suppliersService: SuppliersService,
    private readonly accountService: AccountService,
  ) {}

  //  create payment voucher
  async createPaymentVoucher(
    createpaymentVoucherDto: CreatePaymentVoucherDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const supplierInfo = await this.suppliersService.findOneSupplier(
        createpaymentVoucherDto.supplierId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        createpaymentVoucherDto.accountId,
      );

      createpaymentVoucherDto['createdBy'] = userPayload.id;

      delete createpaymentVoucherDto.supplierId;
      delete createpaymentVoucherDto.accountId;
      const insertData = await this.paymentVoucherRepository.save(
        createpaymentVoucherDto,
      );

      insertData.supplier = supplierInfo;
      insertData.account = accountInfo;

      const savepaymentVoucher =
        await this.paymentVoucherRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return savepaymentVoucher;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update payment Voucher
  async updatepaymentVoucher(
    updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updatePaymentVoucherDto['updatedAt'] = new Date();
      updatePaymentVoucherDto['updatedBy'] = userPayload.id;

      const supplierInfo = await this.suppliersService.findOneSupplier(
        updatePaymentVoucherDto.supplierId,
      );
      const accountInfo = await this.accountService.findOneAccount(
        updatePaymentVoucherDto.accountId,
      );

      delete updatePaymentVoucherDto.supplierId;
      delete updatePaymentVoucherDto.accountId;

      const paymentVoucherData = await this.paymentVoucherRepository
        .createQueryBuilder()
        .update(PaymentVoucherEntity, updatePaymentVoucherDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.paymentVoucherRepository
        .createQueryBuilder('paymentvoucher')
        .where(`paymentvoucher.id = ${id}`)
        .getOne();

      dataFind.supplier = supplierInfo;
      dataFind.account = accountInfo;
      await this.paymentVoucherRepository.save(dataFind);

      return `payment Voucher Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all payment Voucher Data
  async findAllpaymentVoucherData(
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

    const [results, total] = await this.paymentVoucherRepository
      .createQueryBuilder('paymentvoucher')
      .leftJoinAndSelect('paymentvoucher.supplier', 'supplier')
      .leftJoinAndSelect('paymentvoucher.account', 'account')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`paymentvoucher.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('paymentvoucher.id', 'DESC')
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

  // delete payment voucher
  async deletepaymentVoucher(id: number): Promise<any> {
    try {
      const paymentVoucherData = await this.paymentVoucherRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!paymentVoucherData) {
        throw new NotFoundException('paymentVoucherData not found');
      }

      return await this.paymentVoucherRepository.remove(paymentVoucherData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One payment voucher
   */
  async findOnepaymentVoucherData(id: number) {
    const data = await this.paymentVoucherRepository.findOne({
      where: {
        id: id,
      },
      relations: ['account'],
    });
    if (!data) {
      throw new NotFoundException(`payment voucher not exist in db!!`);
    }
    return data;
  }
}

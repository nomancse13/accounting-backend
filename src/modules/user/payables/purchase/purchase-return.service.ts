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
import { PurchaseRetrunEntity } from './entity';
import { SuppliersService } from '../supplier/suppliers.service';
import { CreatePurchaseReturnDto, UpdatePurchaseReturnDto } from './dtos';

@Injectable()
export class PurchaseReturnService {
  constructor(
    @InjectRepository(PurchaseRetrunEntity)
    private purchaseReturnRepository: BaseRepository<PurchaseRetrunEntity>,
    private readonly suppliersService: SuppliersService,
  ) {}

  //  create purchase return
  async createPurchaseReturn(
    createPurchaseReturnDto: CreatePurchaseReturnDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const supplierInfo = await this.suppliersService.findOneSupplier(
        createPurchaseReturnDto.supplierId,
      );

      createPurchaseReturnDto['createdBy'] = userPayload.id;

      const insertData = await this.purchaseReturnRepository.save(
        createPurchaseReturnDto,
      );

      insertData.supplier = supplierInfo;

      const savePurchaseReturn =
        await this.purchaseReturnRepository.save(insertData);

      return savePurchaseReturn;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update purchase return
  async updatePurchaseReturn(
    updatePurchaseReturnDto: UpdatePurchaseReturnDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updatePurchaseReturnDto['updatedAt'] = new Date();
      updatePurchaseReturnDto['updatedBy'] = userPayload.id;

      const supplierInfo = await this.suppliersService.findOneSupplier(
        updatePurchaseReturnDto.supplierId,
      );

      delete updatePurchaseReturnDto.supplierId;

      const saleVoucherData = await this.purchaseReturnRepository
        .createQueryBuilder()
        .update(PurchaseRetrunEntity, updatePurchaseReturnDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.purchaseReturnRepository
        .createQueryBuilder('purchasereturn')
        .where(`purchasereturn.id = ${id}`)
        .getOne();

      dataFind.supplier = supplierInfo;

      await this.purchaseReturnRepository.save(dataFind);

      return `purchase return Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }
  }

  // find all purchase return Data
  async findAllPurchaseReturnData(
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

    const [results, total] = await this.purchaseReturnRepository
      .createQueryBuilder('purchasereturn')
      .leftJoinAndSelect('purchasereturn.supplier', 'supplier')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`purchasereturn.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('purchasereturn.id', 'DESC')
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

  // delete purchase return
  async deletePurchaseReturn(id: number): Promise<any> {
    try {
      const purchaseReturn = await this.purchaseReturnRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!purchaseReturn) {
        throw new NotFoundException('purchase return data not found');
      }

      return await this.purchaseReturnRepository.remove(purchaseReturn);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One purchase return
   */
  async findPurchaseReturnData(id: number) {
    const data = await this.purchaseReturnRepository.findOne({
      where: {
        id: id,
      },
      relations: ['supplier'],
    });
    if (!data) {
      throw new NotFoundException(`purchase return id not exist in db!!`);
    }
    return data;
  }
}

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
import { LedgersService } from '../../account/ledgers/ledgers.service';
import { SuppliersService } from '../supplier/suppliers.service';
import { SupplierInvoiceEntity } from './entities';
import { CreateSupplierInvoiceDto, UpdateSupplierInvoiceDto } from './dtos';

@Injectable()
export class SupplierInvoiceService {
  constructor(
    @InjectRepository(SupplierInvoiceEntity)
    private supplierInvoiceRepository: BaseRepository<SupplierInvoiceEntity>,
    private readonly ledgersService: LedgersService,
    private readonly suppliersService: SuppliersService,
  ) {}

  //  create supplier invoice
  async createSupplierInvoice(
    createSupplierInvoiceDto: CreateSupplierInvoiceDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const supplierInfo = await this.suppliersService.findOneSupplier(
        createSupplierInvoiceDto.supplierId,
      );

      createSupplierInvoiceDto['createdBy'] = userPayload.id;

      let total = createSupplierInvoiceDto.total;

      if (createSupplierInvoiceDto.vat == true) {
        total = createSupplierInvoiceDto.subtotal * 0.16;
      }

      if (createSupplierInvoiceDto.total == total) {
        const insertData = await this.supplierInvoiceRepository.save(
          createSupplierInvoiceDto,
        );

        insertData.supplier = supplierInfo;

        const saveSupplierInvoice =
          await this.supplierInvoiceRepository.save(insertData);

        // userType.users = [...userType.users, insertData];

        return saveSupplierInvoice;
      } else {
        throw new BadRequestException(
          `total count is not correct. please fix it!!!`,
        );
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update supplier invoice
  async updateSupplierInvoice(
    updateSupplierInvoiceDto: UpdateSupplierInvoiceDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateSupplierInvoiceDto['updatedAt'] = new Date();
      updateSupplierInvoiceDto['updatedBy'] = userPayload.id;
      const supplierInfo = await this.suppliersService.findOneSupplier(
        updateSupplierInvoiceDto.supplierId,
      );

      let total = updateSupplierInvoiceDto.total;

      if (updateSupplierInvoiceDto.vat == true) {
        total = updateSupplierInvoiceDto.subtotal * 0.16;
      }

      delete updateSupplierInvoiceDto.supplierId;

      if (updateSupplierInvoiceDto.total == total) {
        const bankingData = await this.supplierInvoiceRepository
          .createQueryBuilder()
          .update(SupplierInvoiceEntity, updateSupplierInvoiceDto)
          .where(`id = '${id}'`)
          .execute();
        const dataFind = await this.supplierInvoiceRepository
          .createQueryBuilder('invoice')
          .where(`invoice.id = ${id}`)
          .getOne();

        dataFind.supplier = supplierInfo;
        await this.supplierInvoiceRepository.save(dataFind);
        return `supplier invoice data updated successfully!!!`;
      } else {
        throw new BadRequestException(
          `total count is not correct. please fix it!!!`,
        );
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }
  }

  // find all supplier invoice data
  async findAllSupplierInvoiceData(
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

    const [results, total] = await this.supplierInvoiceRepository
      .createQueryBuilder('supplierinv')
      .leftJoinAndSelect('supplierinv.supplier', 'supplier')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`supplierinv.invoiceNo ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('supplierinv.id', 'DESC')
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

  // delete supplier invoice
  async deleteSupplierInvoice(id: number): Promise<any> {
    try {
      const invoiceData = await this.supplierInvoiceRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!invoiceData) {
        throw new NotFoundException('supplier invoice not found');
      }

      return await this.supplierInvoiceRepository.remove(invoiceData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One supplier invoice data
   */
  async findOneSupplierInvoice(id: number) {
    const data = await this.supplierInvoiceRepository.findOne({
      where: {
        id: id,
      },
      relations: ['supplier'],
    });
    if (!data) {
      throw new NotFoundException(`supplier invoice not exist in db!!`);
    }
    return data;
  }
}

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
import { SuppliersEntity } from './entity';
import { CreateSuppliersDto, UpdateSuppliersDto } from './dtos';
import { LedgersService } from '../../account/ledgers/ledgers.service';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SuppliersEntity)
    private suppliersRepository: BaseRepository<SuppliersEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create suppliers
  async createSuppliers(
    createSuppliersDto: CreateSuppliersDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const ledgerInfo = await this.ledgersService.findOneLedger(
        createSuppliersDto.ledgerId,
      );
      const currencyInfo = await this.ledgersService.findOneCurrency(
        createSuppliersDto.currencyId,
      );

      createSuppliersDto['createdBy'] = userPayload.id;

      const insertData =
        await this.suppliersRepository.save(createSuppliersDto);

      insertData.ledger = ledgerInfo;
      insertData.currency = currencyInfo;

      const saveSuppliers = await this.suppliersRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveSuppliers;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update Suppliers
  async updateSuppliers(
    updateSuppliersDto: UpdateSuppliersDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateSuppliersDto['updatedAt'] = new Date();
      updateSuppliersDto['updatedBy'] = userPayload.id;

      const ledgerInfo = await this.ledgersService.findOneLedger(
        updateSuppliersDto.ledgerId,
      );

      const currencyInfo = await this.ledgersService.findOneCurrency(
        updateSuppliersDto.currencyId,
      );
      delete updateSuppliersDto.ledgerId;
      delete updateSuppliersDto.currencyId;

      const bankingData = await this.suppliersRepository
        .createQueryBuilder()
        .update(SuppliersEntity, updateSuppliersDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.suppliersRepository
        .createQueryBuilder('supplier')
        .where(`supplier.id = ${id}`)
        .getOne();

      dataFind.currency = currencyInfo;
      dataFind.ledger = ledgerInfo;

      await this.suppliersRepository.save(dataFind);

      return `suppliers data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all suppliers data
  async findAllSuppliersData(
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

    const [results, total] = await this.suppliersRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.currency', 'currency')
      .leftJoinAndSelect('supplier.ledger', 'ledger')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`supplier.bothName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('supplier.id', 'DESC')
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

  // delete supplier
  async deleteSupplier(id: number): Promise<any> {
    try {
      const customersData = await this.suppliersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!customersData) {
        throw new NotFoundException('supplier not found');
      }

      return await this.suppliersRepository.remove(customersData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One supplier data
   */
  async findOneSupplier(id: number) {
    const data = await this.suppliersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['ledger', 'currency'],
    });
    if (!data) {
      throw new NotFoundException(`supplier not exist in db!!`);
    }
    return data;
  }
}

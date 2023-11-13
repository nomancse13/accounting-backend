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
import { LedgersService } from '../account/ledgers/ledgers.service';
import { VendorsEntity } from './entity';
import { CreateVendorsDto, UpdateVendorsDto } from './dtos';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorsEntity)
    private vendorsRepository: BaseRepository<VendorsEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create vendors
  async createVendors(
    createVendorsDto: CreateVendorsDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const ledgerInfo = await this.ledgersService.findOneLedger(
        createVendorsDto.ledgerId,
      );
      const currencyInfo = await this.ledgersService.findOneCurrency(
        createVendorsDto.currencyId,
      );
      const supplierledger1 = await this.ledgersService.findOneLedger(
        createVendorsDto.supplierledgerId1,
      );
      const supplierledger2 = await this.ledgersService.findOneLedger(
        createVendorsDto.supplierledgerId2,
      );
      const customerLedger = await this.ledgersService.findOneLedger(
        createVendorsDto.customerledgerId,
      );

      createVendorsDto['createdBy'] = userPayload.id;

      const insertData = await this.vendorsRepository.save(createVendorsDto);

      insertData.ledger = ledgerInfo;
      insertData.currency = currencyInfo;
      insertData.supplierledger1 = supplierledger1;
      insertData.supplierledger2 = supplierledger2;
      insertData.customerledger = customerLedger;

      const saveVendors = await this.vendorsRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveVendors;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update vendors
  async updateVendors(
    updateVendorsDto: UpdateVendorsDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateVendorsDto['updatedAt'] = new Date();
      updateVendorsDto['updatedBy'] = userPayload.id;

      const ledgerInfo = await this.ledgersService.findOneLedger(
        updateVendorsDto.ledgerId,
      );

      const currencyInfo = await this.ledgersService.findOneCurrency(
        updateVendorsDto.currencyId,
      );

      const supplierledger1 = await this.ledgersService.findOneLedger(
        updateVendorsDto.supplierledgerId1,
      );
      const supplierledger2 = await this.ledgersService.findOneLedger(
        updateVendorsDto.supplierledgerId2,
      );
      const customerLedger = await this.ledgersService.findOneLedger(
        updateVendorsDto.customerledgerId,
      );

      delete updateVendorsDto.ledgerId;
      delete updateVendorsDto.currencyId;
      delete updateVendorsDto.supplierledgerId1;
      delete updateVendorsDto.supplierledgerId2;
      delete updateVendorsDto.customerledgerId;

      const bankingData = await this.vendorsRepository
        .createQueryBuilder()
        .update(VendorsEntity, updateVendorsDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.vendorsRepository
        .createQueryBuilder('vendors')
        .where(`vendors.id = ${id}`)
        .getOne();

      dataFind.currency = currencyInfo;
      dataFind.ledger = ledgerInfo;
      dataFind.supplierledger2 = supplierledger2;
      dataFind.customerledger = customerLedger;
      dataFind.supplierledger1 = supplierledger1;
      await this.vendorsRepository.save(dataFind);

      return `vendors data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all vendors data
  async findAllVendorsData(
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

    const [results, total] = await this.vendorsRepository
      .createQueryBuilder('vendors')
      .leftJoinAndSelect('vendors.currency', 'currency')
      .leftJoinAndSelect('vendors.ledger', 'ledger')
      .leftJoinAndSelect('vendors.supplierledger1', 'supplierledger1')
      .leftJoinAndSelect('vendors.customerledger', 'customerledger')
      .leftJoinAndSelect('vendors.supplierledger2', 'supplierledger2')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`vendors.vendorName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('vendors.id', 'DESC')
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

  // delete vendors
  async deleteVendors(id: number): Promise<any> {
    try {
      const vendorsData = await this.vendorsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!vendorsData) {
        throw new NotFoundException('vendors not found');
      }

      return await this.vendorsRepository.remove(vendorsData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One vendorsData
   */
  async findOneVendors(id: number) {
    const data = await this.vendorsRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'ledger',
        'currency',
        'supplierledger1',
        'supplierledger2',
        'customerledger',
      ],
    });
    if (!data) {
      throw new NotFoundException(`vendors not exist in db!!`);
    }
    return data;
  }
}

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
import { SalesEntity } from './entity';
import { CreateSalesDto, UpdateSalesDto } from './dtos';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesEntity)
    private salesRepository: BaseRepository<SalesEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create sales
  async createSales(
    createSalesDto: CreateSalesDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const debitledger = await this.ledgersService.findOneLedger(
        createSalesDto.debitledgerId,
      );
      const salesledger = await this.ledgersService.findOneLedger(
        createSalesDto.salesledgerId,
      );
      const bankledger = await this.ledgersService.findOneLedger(
        createSalesDto.bankledgerId,
      );
      const paidcurrencies = await this.ledgersService.findOneCurrency(
        createSalesDto.paidcurrencyId,
      );
      const salecurrencies = await this.ledgersService.findOneCurrency(
        createSalesDto.salecurrencyId,
      );

      createSalesDto['createdBy'] = userPayload.id;

      const insertData = await this.salesRepository.save(createSalesDto);

      insertData.salecurrencies = salecurrencies;
      insertData.paidcurrencies = paidcurrencies;
      insertData.bankledger = bankledger;
      insertData.salesledger = salesledger;
      insertData.debitledger = debitledger;

      const saveSales = await this.salesRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveSales;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update sales
  async updateSales(
    updateSalesDto: UpdateSalesDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateSalesDto['updatedAt'] = new Date();
      updateSalesDto['updatedBy'] = userPayload.id;

      const debitledger = await this.ledgersService.findOneLedger(
        updateSalesDto.debitledgerId,
      );
      const salesledger = await this.ledgersService.findOneLedger(
        updateSalesDto.salesledgerId,
      );
      const bankledger = await this.ledgersService.findOneLedger(
        updateSalesDto.bankledgerId,
      );
      const paidcurrencies = await this.ledgersService.findOneCurrency(
        updateSalesDto.paidcurrencyId,
      );
      const salecurrencies = await this.ledgersService.findOneCurrency(
        updateSalesDto.salecurrencyId,
      );

      delete updateSalesDto.salecurrencyId;
      delete updateSalesDto.paidcurrencyId;
      delete updateSalesDto.debitledgerId;
      delete updateSalesDto.bankledgerId;
      delete updateSalesDto.salesledgerId;

      const purchaseData = await this.salesRepository
        .createQueryBuilder()
        .update(SalesEntity, updateSalesDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.salesRepository
        .createQueryBuilder('sales')
        .where(`sales.id = ${id}`)
        .getOne();

      dataFind.salecurrencies = salecurrencies;
      dataFind.paidcurrencies = paidcurrencies;
      dataFind.bankledger = bankledger;
      dataFind.debitledger = debitledger;
      dataFind.salesledger = salesledger;

      await this.salesRepository.save(dataFind);

      return `sales data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all sales data
  async findAllSalesData(
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

    const [results, total] = await this.salesRepository
      .createQueryBuilder('sales')
      .leftJoinAndSelect('sales.paidcurrencies', 'paidcurrencies')
      .leftJoinAndSelect('sales.salecurrencies', 'salecurrencies')
      .leftJoinAndSelect('sales.debitledger', 'debitledger')
      .leftJoinAndSelect('sales.salesledger', 'salesledger')
      .leftJoinAndSelect('sales.bankledger', 'bankledger')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`sales.cashSaleNo ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('sales.id', 'DESC')
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

  // delete sales
  async deleteSales(id: number): Promise<any> {
    try {
      const salesData = await this.salesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!salesData) {
        throw new NotFoundException('sales not found');
      }

      return await this.salesRepository.remove(salesData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One sales
   */
  async findOneSalesData(id: number) {
    const data = await this.salesRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'paidcurrencies',
        'salecurrencies',
        'debitledger',
        'salesledger',
        'bankledger',
      ],
    });
    if (!data) {
      throw new NotFoundException(`sales not exist in db!!`);
    }
    return data;
  }
}

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
import { CreateCustormersDto, UpdateCustomersDto } from './dtos';
import { CustomersEntity } from './entity';
import { LedgersService } from '../account/ledgers/ledgers.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private customersRepository: BaseRepository<CustomersEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create customers
  async createCustomers(
    createCustormersDto: CreateCustormersDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const ledgerInfo = await this.ledgersService.findOneLedger(
        createCustormersDto.ledgerId,
      );
      const currencyInfo = await this.ledgersService.findOneCurrency(
        createCustormersDto.currencyId,
      );
      const supplierledger = await this.ledgersService.findOneLedger(
        createCustormersDto.supplierledgerId,
      );
      const customerLedger1 = await this.ledgersService.findOneLedger(
        createCustormersDto.customerledgerId1,
      );
      const customerLedger2 = await this.ledgersService.findOneLedger(
        createCustormersDto.customerledgerId2,
      );

      createCustormersDto['createdBy'] = userPayload.id;

      const insertData =
        await this.customersRepository.save(createCustormersDto);

      insertData.ledger = ledgerInfo;
      insertData.currency = currencyInfo;
      insertData.customerledger1 = customerLedger1;
      insertData.customerledger2 = customerLedger2;
      insertData.supplierledger = supplierledger;

      const saveCustomers = await this.customersRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveCustomers;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update customers
  async updateCustomers(
    updateCustomersDto: UpdateCustomersDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateCustomersDto['updatedAt'] = new Date();
      updateCustomersDto['updatedBy'] = userPayload.id;

      const ledgerInfo = await this.ledgersService.findOneLedger(
        updateCustomersDto.ledgerId,
      );

      const currencyInfo = await this.ledgersService.findOneCurrency(
        updateCustomersDto.currencyId,
      );

      const supplierledger = await this.ledgersService.findOneLedger(
        updateCustomersDto.supplierledgerId,
      );
      const customerLedger1 = await this.ledgersService.findOneLedger(
        updateCustomersDto.customerledgerId1,
      );
      const customerLedger2 = await this.ledgersService.findOneLedger(
        updateCustomersDto.customerledgerId2,
      );

      delete updateCustomersDto.ledgerId;
      delete updateCustomersDto.currencyId;
      delete updateCustomersDto.supplierledgerId;
      delete updateCustomersDto.customerledgerId1;
      delete updateCustomersDto.customerledgerId2;

      const bankingData = await this.customersRepository
        .createQueryBuilder()
        .update(CustomersEntity, updateCustomersDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.customersRepository
        .createQueryBuilder('customers')
        .where(`customers.id = ${id}`)
        .getOne();

      dataFind.currency = currencyInfo;
      dataFind.ledger = ledgerInfo;
      dataFind.customerledger1 = customerLedger1;
      dataFind.customerledger2 = customerLedger2;
      dataFind.supplierledger = supplierledger;
      await this.customersRepository.save(dataFind);

      return `customers data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all customers data
  async findAllCustomersData(
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

    const [results, total] = await this.customersRepository
      .createQueryBuilder('customers')
      .leftJoinAndSelect('customers.currency', 'currency')
      .leftJoinAndSelect('customers.ledger', 'ledger')
      .leftJoinAndSelect('customers.supplierledger', 'supplierledger')
      .leftJoinAndSelect('customers.customerledger1', 'customerledger1')
      .leftJoinAndSelect('customers.customerledger2', 'customerledger2')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`customers.customerName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('customers.id', 'DESC')
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

  // delete customers
  async deleteCustomer(id: number): Promise<any> {
    try {
      const customersData = await this.customersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!customersData) {
        throw new NotFoundException('customer not found');
      }

      return await this.customersRepository.remove(customersData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One customersData
   */
  async findOneCustomer(id: number) {
    const data = await this.customersRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'ledger',
        'currency',
        'supplierledger',
        'customerledger1',
        'customerledger2',
      ],
    });
    if (!data) {
      throw new NotFoundException(`customers not exist in db!!`);
    }
    return data;
  }
}

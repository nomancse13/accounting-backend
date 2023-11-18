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
import { LedgersService } from '../../account/ledgers/ledgers.service';
import { ExpensesEntity } from './entity';
import { CreateExpensesDto, UpdateExpensesDto } from './dtos';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesEntity)
    private expensesRepository: BaseRepository<ExpensesEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create expense
  async createExpense(
    createExpensesDto: CreateExpensesDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const ledgerExpenseInfo = await this.ledgersService.findOneLedger(
        createExpensesDto.ledgerExpenseId,
      );
      const ledgerPaidInfo = await this.ledgersService.findOneLedger(
        createExpensesDto.ledgerPaidId,
      );

      createExpensesDto['createdBy'] = userPayload.id;

      delete createExpensesDto.ledgerExpenseId;
      delete createExpensesDto.location;

      const insertData = await this.expensesRepository.save(createExpensesDto);

      insertData.ledgerExpense = ledgerExpenseInfo;
      insertData.ledgerPaid = ledgerPaidInfo;

      const saveExpensesInfo = await this.expensesRepository.save(insertData);

      return saveExpensesInfo;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update expenses
  async updateExpenses(
    updateExpensesDto: UpdateExpensesDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateExpensesDto['updatedAt'] = new Date();
      updateExpensesDto['updatedBy'] = userPayload.id;

      const ledgerExpenseInfo = await this.ledgersService.findOneLedger(
        updateExpensesDto.ledgerExpenseId,
      );
      const ledgerPaidInfo = await this.ledgersService.findOneLedger(
        updateExpensesDto.ledgerPaidId,
      );

      delete updateExpensesDto.ledgerExpenseId;
      delete updateExpensesDto.ledgerPaidId;

      const saleVoucherData = await this.expensesRepository
        .createQueryBuilder()
        .update(ExpensesEntity, updateExpensesDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.expensesRepository
        .createQueryBuilder('expenses')
        .where(`expenses.id = ${id}`)
        .getOne();

      dataFind.ledgerExpense = ledgerExpenseInfo;
      dataFind.ledgerPaid = ledgerPaidInfo;

      await this.expensesRepository.save(dataFind);

      return `expenses Data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }
  }

  // find all expenses Data
  async findAllExpensesData(
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

    const [results, total] = await this.expensesRepository
      .createQueryBuilder('expenses')
      .leftJoinAndSelect('expenses.ledgerExpense', 'ledgerExpense')
      .leftJoinAndSelect('expenses.ledgerPaid', 'ledgerPaid')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`expenses.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('expenses.id', 'DESC')
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

  // delete expenses
  async deleteExpenses(id: number): Promise<any> {
    try {
      const expenses = await this.expensesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!expenses) {
        throw new NotFoundException('expenses data not found');
      }

      return await this.expensesRepository.remove(expenses);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One expenses
   */
  async findOneExpenses(id: number) {
    const data = await this.expensesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['ledgerExpense', 'ledgerPaid'],
    });
    if (!data) {
      throw new NotFoundException(`expense id not exist in db!!`);
    }
    return data;
  }
}

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
import { CreateBankingDto, UpdateBankingDto } from './dtos';
import { BankAccountEntity } from './entity';
import { LedgersService } from '../account/ledgers/ledgers.service';

@Injectable()
export class BankingService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private bankingRepository: BaseRepository<BankAccountEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create Bank account
  async createBankAcc(
    createBankingDto: CreateBankingDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const ledgerInfo = await this.ledgersService.findOneLedger(
        createBankingDto.ledgerId,
      );
      const currencyInfo = await this.ledgersService.findOneCurrency(
        createBankingDto.currencyId,
      );

      createBankingDto['createdBy'] = userPayload.id;

      const insertData = await this.bankingRepository.save(createBankingDto);

      insertData.ledger = ledgerInfo;
      insertData.currency = currencyInfo;

      const saveBankAccount = await this.bankingRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveBankAccount;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update bank account
  async updateBankAccount(
    updateBankingDto: UpdateBankingDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateBankingDto['updatedAt'] = new Date();
      updateBankingDto['updatedBy'] = userPayload.id;

      const ledgerInfo = await this.ledgersService.findOneLedger(
        updateBankingDto.ledgerId,
      );

      console.log(ledgerInfo, 'lledge');

      const currencyInfo = await this.ledgersService.findOneCurrency(
        updateBankingDto.currencyId,
      );

      delete updateBankingDto.ledgerId;
      delete updateBankingDto.currencyId;

      const bankingData = await this.bankingRepository
        .createQueryBuilder()
        .update(BankAccountEntity, updateBankingDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.bankingRepository
        .createQueryBuilder('banking')
        .where(`banking.id = ${id}`)
        .getOne();

      dataFind.currency = currencyInfo;
      dataFind.ledger = ledgerInfo;
      await this.bankingRepository.save(dataFind);

      return `bankingData updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all banking data
  async findAllBankingData(
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

    const [results, total] = await this.bankingRepository
      .createQueryBuilder('banking')
      .leftJoinAndSelect('banking.currency', 'currency')
      .leftJoinAndSelect('banking.ledger', 'ledger')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`banking.bankAccountName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('banking.id', 'DESC')
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

  // delete banking
  async deleteBanking(id: number): Promise<any> {
    try {
      const bankingData = await this.bankingRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!bankingData) {
        throw new NotFoundException('organizations not found');
      }

      return await this.bankingRepository.remove(bankingData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One banking
   */
  async findOneBanking(id: number) {
    const data = await this.bankingRepository.findOne({
      where: {
        id: id,
      },
      relations: ['ledger', 'currency'],
    });
    if (!data) {
      throw new NotFoundException(`organizations not exist in db!!`);
    }
    return data;
  }
}

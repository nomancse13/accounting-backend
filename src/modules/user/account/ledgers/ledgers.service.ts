import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLedgersDto, UpdateLedgersDto } from './dtos';
import {
  Pagination,
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { LedgersEntity } from './entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { decrypt } from 'src/helper/crypto.helper';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';
import { Brackets } from 'typeorm';
import { CurrencyEntity } from '../entities';

@Injectable()
export class LedgersService {
  constructor(
    @InjectRepository(LedgersEntity)
    private ledgersRepository: BaseRepository<LedgersEntity>,
    @InjectRepository(CurrencyEntity)
    private currencyRepository: BaseRepository<CurrencyEntity>,
  ) {}

  //  create ledger
  async createLedger(
    createLedgersDto: CreateLedgersDto,
    userPayload: UserInterface,
  ): Promise<any> {
    const currency = await this.currencyRepository.findOne({
      where: {
        id: createLedgersDto.currencyId,
      },
      relations: ['ledgers'],
    });

    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    createLedgersDto['createdBy'] = userPayload.id;

    delete createLedgersDto.currencyId;
    const insertData = await this.ledgersRepository.save(createLedgersDto);

    insertData.currency = currency;

    const savedLedger = await this.ledgersRepository.save(insertData);

    return savedLedger;
  }

  // update ledger
  async updateLedger(
    updateLedgersDto: UpdateLedgersDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      const currency = await this.findOneCurrency(updateLedgersDto.currencyId);

      updateLedgersDto['updatedAt'] = new Date();
      updateLedgersDto['updatedBy'] = userPayload.id;

      delete updateLedgersDto.currencyId;

      const data = await this.ledgersRepository
        .createQueryBuilder()
        .update(LedgersEntity, updateLedgersDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.ledgersRepository
        .createQueryBuilder('ledger')
        .where(`ledger.id = ${id}`)
        .getOne();

      dataFind.currency = currency;
      await this.ledgersRepository.save(dataFind);
      return `user profile updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all ledger
  async findAllLedger(
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

    const [results, total] = await this.ledgersRepository
      .createQueryBuilder('ledger')
      .leftJoinAndSelect('ledger.currency', 'currency')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`ledger.ledgerName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('ledger.id', 'DESC')
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

  // delete ledger
  async deleteLedger(id: number): Promise<any> {
    try {
      const ledger = await this.ledgersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!ledger) {
        throw new NotFoundException('ledger not found');
      }

      return await this.ledgersRepository.remove(ledger);
    } catch (e) {
      throw new BadRequestException(
        `this ledger related as a foreign member. can not deleted`,
      );
    }
  }

  /**
   * Get One ledger
   */
  async findOneLedger(id: number) {
    const data = await this.ledgersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['users', 'currency'],
    });
    if (!data) {
      throw new NotFoundException(`Ledger not exist in db!!`);
    }

    return data;
  }
  /**
   * Get One currency
   */
  async findOneCurrency(id: number) {
    const data = await this.currencyRepository.findOne({
      where: {
        id: id,
      },
      relations: ['users'],
    });
    if (!data) {
      throw new NotFoundException(`currency not exist in db!!`);
    }
    return data;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLedgersDto } from './dtos';
import { UserInterface } from 'src/authentication/common/interfaces';
import { LedgersEntity } from './entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyEntity } from '../currency/entity';
import { decrypt } from 'src/helper/crypto.helper';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';

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

    delete createLedgersDto.currencyId;
    const insertData = await this.ledgersRepository.save(createLedgersDto);

    insertData.currency = currency;

    const savedLedger = await this.ledgersRepository.save(insertData);

    return savedLedger;
  }
}

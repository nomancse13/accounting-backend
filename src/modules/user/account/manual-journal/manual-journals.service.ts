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
import { LedgersService } from '../ledgers/ledgers.service';
import { ManualJournalsEntity } from './entities';
import { CreateManualJounalsDto, UpdateManualJounalsDto } from './dtos';

@Injectable()
export class ManualJournalsService {
  constructor(
    @InjectRepository(ManualJournalsEntity)
    private manualJournalsRepository: BaseRepository<ManualJournalsEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create manual journals
  async createManualJournals(
    createManualJounalsDto: CreateManualJounalsDto,
    userPayload: UserInterface,
  ): Promise<any> {
    try {
      // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
      // }
      const debitInfo = await this.ledgersService.findOneLedger(
        createManualJounalsDto.debitId,
      );
      const creditInfo = await this.ledgersService.findOneLedger(
        createManualJounalsDto.creditId,
      );

      createManualJounalsDto['createdBy'] = userPayload.id;

      delete createManualJounalsDto.debitId;
      delete createManualJounalsDto.creditId;

      const insertData = await this.manualJournalsRepository.save(
        createManualJounalsDto,
      );

      insertData.debit = debitInfo;
      insertData.credit = creditInfo;

      const saveManualJournals =
        await this.manualJournalsRepository.save(insertData);

      return saveManualJournals;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update manual journals
  async updateManualJournals(
    updateManualJounalsDto: UpdateManualJounalsDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateManualJounalsDto['updatedAt'] = new Date();
      updateManualJounalsDto['updatedBy'] = userPayload.id;
      const debitInfo = await this.ledgersService.findOneLedger(
        updateManualJounalsDto.debitId,
      );
      const creditInfo = await this.ledgersService.findOneLedger(
        updateManualJounalsDto.creditId,
      );

      delete updateManualJounalsDto.debitId;
      delete updateManualJounalsDto.creditId;

      const manualJournalData = await this.manualJournalsRepository
        .createQueryBuilder()
        .update(ManualJournalsEntity, updateManualJounalsDto)
        .where(`id = '${id}'`)
        .execute();
      const dataFind = await this.manualJournalsRepository
        .createQueryBuilder('manualjournal')
        .where(`manualjournal.id = ${id}`)
        .getOne();

      dataFind.debit = debitInfo;
      dataFind.credit = creditInfo;
      await this.manualJournalsRepository.save(dataFind);
      return `manual journal data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }
  }

  // find all manual journal data
  async findAllManualjournalData(
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

    const [results, total] = await this.manualJournalsRepository
      .createQueryBuilder('manualjournal')
      .leftJoinAndSelect('manualjournal.supplier', 'supplier')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`manualjournal.voucher ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('manualjournal.id', 'DESC')
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

  // delete manual journal
  async deleteManuaJournal(id: number): Promise<any> {
    try {
      const manualJournalData = await this.manualJournalsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!manualJournalData) {
        throw new NotFoundException('manualJournalData not found');
      }

      return await this.manualJournalsRepository.remove(manualJournalData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One manual Journal Data
   */
  async findOneManualJournalData(id: number) {
    const data = await this.manualJournalsRepository.findOne({
      where: {
        id: id,
      },
      relations: ['debit', 'credit'],
    });
    if (!data) {
      throw new NotFoundException(`manual journal not exist in db!!`);
    }
    return data;
  }
}

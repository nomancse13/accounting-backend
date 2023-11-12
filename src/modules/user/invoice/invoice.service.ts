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
import { InvoiceEntity } from './entities';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dtos';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: BaseRepository<InvoiceEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create invoice
  async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const debitLedger = await this.ledgersService.findOneLedger(
        createInvoiceDto.debitLedgerId,
      );
      const creditLedger = await this.ledgersService.findOneLedger(
        createInvoiceDto.creditLedgerId,
      );
      const debitCurrencies = await this.ledgersService.findOneCurrency(
        createInvoiceDto.debitCurrencyId,
      );
      const creditCurrencies = await this.ledgersService.findOneCurrency(
        createInvoiceDto.creditCurrencyId,
      );

      createInvoiceDto['createdBy'] = userPayload.id;

      const insertData = await this.invoiceRepository.save(createInvoiceDto);

      insertData.debitLedger = debitLedger;
      insertData.creditLedger = creditLedger;

      insertData.debitCurrencies = debitCurrencies;
      insertData.creditCurrencies = creditCurrencies;

      const saveInvoice = await this.invoiceRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveInvoice;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update invoice
  async updateInvoice(
    updateInvoiceDto: UpdateInvoiceDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateInvoiceDto['updatedAt'] = new Date();
      updateInvoiceDto['updatedBy'] = userPayload.id;
      const debitLedger = await this.ledgersService.findOneLedger(
        updateInvoiceDto.debitLedgerId,
      );
      const creditLedger = await this.ledgersService.findOneLedger(
        updateInvoiceDto.creditLedgerId,
      );
      const debitCurrencies = await this.ledgersService.findOneCurrency(
        updateInvoiceDto.debitCurrencyId,
      );
      const creditCurrencies = await this.ledgersService.findOneCurrency(
        updateInvoiceDto.creditCurrencyId,
      );

      delete updateInvoiceDto.debitLedgerId;
      delete updateInvoiceDto.creditLedgerId;
      delete updateInvoiceDto.debitCurrencyId;
      delete updateInvoiceDto.creditCurrencyId;

      const bankingData = await this.invoiceRepository
        .createQueryBuilder()
        .update(InvoiceEntity, updateInvoiceDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.invoiceRepository
        .createQueryBuilder('invoice')
        .where(`invoice.id = ${id}`)
        .getOne();

      dataFind.debitLedger = debitLedger;
      dataFind.creditLedger = creditLedger;

      dataFind.debitCurrencies = debitCurrencies;
      dataFind.creditCurrencies = creditCurrencies;
      await this.invoiceRepository.save(dataFind);

      return `invoice data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all invoice data
  async findAllInvoiceData(
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

    const [results, total] = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.debitLedger', 'debitLedger')
      .leftJoinAndSelect('invoice.creditLedger', 'creditLedger')
      .leftJoinAndSelect('invoice.debitCurrencies', 'debitCurrencies')
      .leftJoinAndSelect('invoice.creditCurrencies', 'creditCurrencies')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`invoice.invoiceNo ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('invoice.id', 'DESC')
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

  // delete invoice
  async deleteInvoice(id: number): Promise<any> {
    try {
      const invoiceData = await this.invoiceRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!invoiceData) {
        throw new NotFoundException('invoice not found');
      }

      return await this.invoiceRepository.remove(invoiceData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One invoice data
   */
  async findOneInvoice(id: number) {
    const data = await this.invoiceRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'debitLedger',
        'creditLedger',
        'debitCurrencies',
        'creditCurrencies',
      ],
    });
    if (!data) {
      throw new NotFoundException(`invoice not exist in db!!`);
    }
    return data;
  }
}

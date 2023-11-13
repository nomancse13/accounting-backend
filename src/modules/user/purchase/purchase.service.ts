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
import { PurchaseEntity } from './entity';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dtos';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: BaseRepository<PurchaseEntity>,
    private readonly ledgersService: LedgersService,
  ) {}

  //  create purchase
  async createPurchase(
    createPurchaseDto: CreatePurchaseDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const supplierledger = await this.ledgersService.findOneLedger(
        createPurchaseDto.supplierledgerId,
      );
      const purchaseledger = await this.ledgersService.findOneLedger(
        createPurchaseDto.purchaseledgerId,
      );
      const bankledger = await this.ledgersService.findOneLedger(
        createPurchaseDto.bankledgerId,
      );
      const paidcurrencies = await this.ledgersService.findOneCurrency(
        createPurchaseDto.paidcurrencyId,
      );
      const purchasecurrencies = await this.ledgersService.findOneCurrency(
        createPurchaseDto.purchasecurrencyId,
      );

      createPurchaseDto['createdBy'] = userPayload.id;

      const insertData = await this.purchaseRepository.save(createPurchaseDto);

      insertData.purchasecurrencies = purchasecurrencies;
      insertData.paidcurrencies = paidcurrencies;
      insertData.bankledger = bankledger;
      insertData.purchaseledger = purchaseledger;
      insertData.supplierledger = supplierledger;

      const savePurchase = await this.purchaseRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return savePurchase;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update purchase
  async updatePurchase(
    updatePurchaseDto: UpdatePurchaseDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updatePurchaseDto['updatedAt'] = new Date();
      updatePurchaseDto['updatedBy'] = userPayload.id;

      const supplierledger = await this.ledgersService.findOneLedger(
        updatePurchaseDto.supplierledgerId,
      );
      const purchaseledger = await this.ledgersService.findOneLedger(
        updatePurchaseDto.purchaseledgerId,
      );
      const bankledger = await this.ledgersService.findOneLedger(
        updatePurchaseDto.bankledgerId,
      );
      const paidcurrencies = await this.ledgersService.findOneCurrency(
        updatePurchaseDto.paidcurrencyId,
      );
      const purchasecurrencies = await this.ledgersService.findOneCurrency(
        updatePurchaseDto.purchasecurrencyId,
      );

      delete updatePurchaseDto.purchasecurrencyId;
      delete updatePurchaseDto.paidcurrencyId;
      delete updatePurchaseDto.supplierledgerId;
      delete updatePurchaseDto.bankledgerId;
      delete updatePurchaseDto.purchaseledgerId;

      const purchaseData = await this.purchaseRepository
        .createQueryBuilder()
        .update(PurchaseEntity, updatePurchaseDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .where(`purchase.id = ${id}`)
        .getOne();

      dataFind.purchasecurrencies = purchasecurrencies;
      dataFind.paidcurrencies = paidcurrencies;
      dataFind.bankledger = bankledger;
      dataFind.purchaseledger = purchaseledger;
      dataFind.supplierledger = supplierledger;

      await this.purchaseRepository.save(dataFind);

      return `purchase data updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all purchase data
  async findAllPurchaseData(
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

    const [results, total] = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.paidcurrencies', 'paidcurrencies')
      .leftJoinAndSelect('purchase.purchasecurrencies', 'purchasecurrencies')
      .leftJoinAndSelect('purchase.supplierledger', 'supplierledger')
      .leftJoinAndSelect('purchase.purchaseledger', 'purchaseledger')
      .leftJoinAndSelect('purchase.bankledger', 'bankledger')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`purchase.cashPurchaseNo ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('purchase.id', 'DESC')
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

  // delete purchase
  async deletePurchase(id: number): Promise<any> {
    try {
      const purchaseData = await this.purchaseRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!purchaseData) {
        throw new NotFoundException('purchase not found');
      }

      return await this.purchaseRepository.remove(purchaseData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One purchaseData
   */
  async findOnePurchase(id: number) {
    const data = await this.purchaseRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'paidcurrencies',
        'purchasecurrencies',
        'supplierledger',
        'purchaseledger',
        'bankledger',
      ],
    });
    if (!data) {
      throw new NotFoundException(`purchase not exist in db!!`);
    }
    return data;
  }
}

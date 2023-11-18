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
import { LedgersService } from '../../account/ledgers/ledgers.service';
import { SuppliersService } from '../supplier/suppliers.service';
import { LsoLpoEntity } from './entities';
import { CreateLsoLpoDto, UpdateLsoLpoDto } from './dtos';

@Injectable()
export class LsoLpoService {
  constructor(
    @InjectRepository(LsoLpoEntity)
    private lsolpoRepository: BaseRepository<LsoLpoEntity>,
    private readonly ledgersService: LedgersService,
    private readonly suppliersService: SuppliersService,
  ) {}

  //  create lso lpo
  async createLsoLpo(
    createLsoLpoDto: CreateLsoLpoDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const supplierInfo = await this.suppliersService.findOneSupplier(
        createLsoLpoDto.supplierId,
      );

      createLsoLpoDto['createdBy'] = userPayload.id;

      let total = createLsoLpoDto.total;

      if (createLsoLpoDto.vat == true) {
        total = createLsoLpoDto.subtotal * 0.16;
      }

      if (createLsoLpoDto.total == total) {
        const insertData = await this.lsolpoRepository.save(createLsoLpoDto);

        insertData.supplier = supplierInfo;

        const saveLpoLso = await this.lsolpoRepository.save(insertData);

        return saveLpoLso;
      } else {
        throw new BadRequestException(
          `total count is not correct. please fix it!!!`,
        );
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update lso lpo
  async updateLsoLpo(
    updateLsoLpoDto: UpdateLsoLpoDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateLsoLpoDto['updatedAt'] = new Date();
      updateLsoLpoDto['updatedBy'] = userPayload.id;
      const supplierInfo = await this.suppliersService.findOneSupplier(
        updateLsoLpoDto.supplierId,
      );

      let total = updateLsoLpoDto.total;

      if (updateLsoLpoDto.vat == true) {
        total = updateLsoLpoDto.subtotal * 0.16;
      }

      delete updateLsoLpoDto.supplierId;

      if (updateLsoLpoDto.total == total) {
        const bankingData = await this.lsolpoRepository
          .createQueryBuilder()
          .update(LsoLpoEntity, updateLsoLpoDto)
          .where(`id = '${id}'`)
          .execute();
        const dataFind = await this.lsolpoRepository
          .createQueryBuilder('lsolpo')
          .where(`lsolpo.id = ${id}`)
          .getOne();

        dataFind.supplier = supplierInfo;
        await this.lsolpoRepository.save(dataFind);
        return `lso lpo data updated successfully!!!`;
      } else {
        throw new BadRequestException(
          `total count is not correct. please fix it!!!`,
        );
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }
  }

  // find all lso lpo data
  async findAllLsoLpoData(
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

    const [results, total] = await this.lsolpoRepository
      .createQueryBuilder('lsolpo')
      .leftJoinAndSelect('lsolpo.supplier', 'supplier')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`lsolpo.invoiceNo ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('lsolpo.id', 'DESC')
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

  // delete lso lpo
  async deleteLsoLpo(id: number): Promise<any> {
    try {
      const lsolpoData = await this.lsolpoRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!lsolpoData) {
        throw new NotFoundException('lsolpoData not found');
      }

      return await this.lsolpoRepository.remove(lsolpoData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One lso lpo data
   */
  async findOneLsoLpo(id: number) {
    const data = await this.lsolpoRepository.findOne({
      where: {
        id: id,
      },
      relations: ['supplier'],
    });
    if (!data) {
      throw new NotFoundException(`lso lpo not exist in db!!`);
    }
    return data;
  }
}

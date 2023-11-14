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
import { decrypt } from 'src/helper/crypto.helper';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';
import { Brackets } from 'typeorm';
import { DesignationEntity } from './entity';
import { CreateDesignationDto, UpdateDesignationDto } from './dtos';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(DesignationEntity)
    private designationRepository: BaseRepository<DesignationEntity>,
  ) {}

  //  create designation
  async createdesignation(
    createDesignationDto: CreateDesignationDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    createDesignationDto['createdBy'] = userPayload.id;

    const insertData =
      await this.designationRepository.save(createDesignationDto);

    return insertData;
  }

  // update designation
  async updatedesignation(
    updatedesignationDto: UpdateDesignationDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updatedesignationDto['updatedAt'] = new Date();
      updatedesignationDto['updatedBy'] = userPayload.id;

      const data = await this.designationRepository
        .createQueryBuilder()
        .update(DesignationEntity, updatedesignationDto)
        .where(`id = '${id}'`)
        .execute();

      return `designation updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all designation
  async findAlldesignation(
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

    const [results, total] = await this.designationRepository
      .createQueryBuilder('designation')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`designation.designationName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('designation.id', 'DESC')
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

  // delete designation
  async deletedesignation(id: number): Promise<any> {
    try {
      const designation = await this.designationRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!designation) {
        throw new NotFoundException('designation not found');
      }

      return await this.designationRepository.remove(designation);
    } catch (e) {
      throw new BadRequestException(
        `this designation not found. can not deleted`,
      );
    }
  }

  /**
   * Get One designation
   */
  async findOnedesignation(id: number) {
    const data = await this.designationRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`this designation not exist in db!!`);
    }
    return data;
  }
}

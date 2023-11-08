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
import { OrganizationsEntity } from './entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyEntity } from '../currency/entity';
import { decrypt } from 'src/helper/crypto.helper';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';
import { Brackets } from 'typeorm';
import { CreateOrganizationsDto, UpdateOrganizationsDto } from './dtos';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationsEntity)
    private organizationsRepository: BaseRepository<OrganizationsEntity>,
  ) {}

  //  create Organizations
  async createOrganizations(
    createOrganizationsDto: CreateOrganizationsDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      createOrganizationsDto['createdBy'] = userPayload.id;

      const savedLedger = await this.organizationsRepository.save(
        createOrganizationsDto,
      );

      return savedLedger;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update Organizations
  async updateOrganizations(
    updateOrganizationsDto: UpdateOrganizationsDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateOrganizationsDto['updatedAt'] = new Date();
      updateOrganizationsDto['updatedBy'] = userPayload.id;

      const organizationsData = await this.organizationsRepository
        .createQueryBuilder()
        .update(OrganizationsEntity, updateOrganizationsDto)
        .where(`id = '${id}'`)
        .execute();

      return `organizationsData updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all organizationsData
  async findAllOrganizations(
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

    const [results, total] = await this.organizationsRepository
      .createQueryBuilder('organizations')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`organizations.organisationName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('organizations.id', 'DESC')
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

  // delete organizations
  async deleteOrganizations(id: number): Promise<any> {
    try {
      const organizations = await this.organizationsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!organizations) {
        throw new NotFoundException('organizations not found');
      }

      return await this.organizationsRepository.remove(organizations);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One organizations
   */
  async findOneOrganizations(id: number) {
    const data = await this.organizationsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`organizations not exist in db!!`);
    }
    return data;
  }
}

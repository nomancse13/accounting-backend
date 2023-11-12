import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccountingGroupDto, UpdateAccountingGroupDto } from './dtos';
import {
  Pagination,
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { AccountingGroupEntity } from './entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { decrypt } from 'src/helper/crypto.helper';
import { ErrorMessage, UserTypesEnum } from 'src/authentication/common/enum';
import { Brackets } from 'typeorm';

@Injectable()
export class AccountingGroupService {
  constructor(
    @InjectRepository(AccountingGroupEntity)
    private accountingGroupRepository: BaseRepository<AccountingGroupEntity>,
  ) {}

  //  create group
  async createAccGroup(
    createAccountingGroupDto: CreateAccountingGroupDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    createAccountingGroupDto['createdBy'] = userPayload.id;

    const insertData = await this.accountingGroupRepository.save(
      createAccountingGroupDto,
    );

    return insertData;
  }

  // update group
  async updateAccGroup(
    updateAccountingGroupDto: UpdateAccountingGroupDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateAccountingGroupDto['updatedAt'] = new Date();
      updateAccountingGroupDto['updatedBy'] = userPayload.id;

      const data = await this.accountingGroupRepository
        .createQueryBuilder()
        .update(AccountingGroupEntity, updateAccountingGroupDto)
        .where(`id = '${id}'`)
        .execute();

      return `group updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all group
  async findAllGroup(
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

    const [results, total] = await this.accountingGroupRepository
      .createQueryBuilder('group')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`group.groupName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('group.id', 'DESC')
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

  // delete group
  async deleteGroup(id: number): Promise<any> {
    try {
      const group = await this.accountingGroupRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!group) {
        throw new NotFoundException('group not found');
      }

      return await this.accountingGroupRepository.remove(group);
    } catch (e) {
      throw new BadRequestException(`this group not found. can not deleted`);
    }
  }

  /**
   * Get One group
   */
  async findOneGroup(id: number) {
    const data = await this.accountingGroupRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`this accounting group not exist in db!!`);
    }
    return data;
  }
}

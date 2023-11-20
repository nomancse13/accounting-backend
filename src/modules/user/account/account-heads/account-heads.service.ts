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
import { CreateAccountHeadsDto, UpdateAccountHeadsDto } from './dtos';
import { AccountingGroupService } from '../accounting-group/accounting-group.service';
import { AccountingGroupEntity } from '../accounting-group/entity';

@Injectable()
export class AccountHeadsService {
  constructor(
    @InjectRepository(AccountingGroupEntity)
    private accountingGroupRepository: BaseRepository<AccountingGroupEntity>,
    private readonly accountingGroupService: AccountingGroupService,
  ) {}

  //  create account heads
  async createAccountHeads(
    createAccountHeadsDto: CreateAccountHeadsDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    const accountGroup = await this.accountingGroupService.findOneGroup(
      createAccountHeadsDto.parentId,
    );

    const findChild = await this.countChild(accountGroup.id);

    const array = accountGroup.groupIdentifier.split('.');

    const findingIndex = array.indexOf('0');

    array[findingIndex] = String(findChild + 1);

    const updatedArray = array.join('.');

    const mainData = {
      groupName: createAccountHeadsDto.name,
      groupParent: createAccountHeadsDto.parentId,
      groupIdentifier: updatedArray,
      groupType: 'demo',
      nature: accountGroup.nature,
      postedTo: accountGroup.postedTo,
      groupHeadType: accountGroup.groupHeadType,
      createdBy: userPayload.id,
    };

    const insertData = await this.accountingGroupRepository.save(mainData);

    return insertData;
  }

  // update account heads
  async updateAccountHeads(
    updateAccountHeadsDto: UpdateAccountHeadsDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateAccountHeadsDto['updatedAt'] = new Date();
      updateAccountHeadsDto['updatedBy'] = userPayload.id;

      const updatedData = {
        groupName: updateAccountHeadsDto.name,
      };

      const data = await this.accountingGroupRepository
        .createQueryBuilder()
        .update(AccountingGroupEntity, updatedData)
        .where(`id = '${id}'`)
        .execute();

      return `accounting heads updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all account heads
  async findAllAccountHeads(
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
      .createQueryBuilder('heads')
      .leftJoinAndMapOne(
        'heads.parent',
        AccountingGroupEntity,
        'parent',
        'heads.groupParent = parent.id',
      )
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`heads.groupName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('heads.id', 'DESC')
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

  // delete account heads
  // async deleteAccountHeads(id: number): Promise<any> {
  //   try {
  //     const heads = await this.accountingGroupRepository.findOne({
  //       where: {
  //         id: id,
  //       },
  //     });

  //     if (!heads) {
  //       throw new NotFoundException('heads not found');
  //     }

  //     return await this.accountingGroupRepository.remove(heads);
  //   } catch (e) {
  //     throw new BadRequestException(
  //       `this heads not found. can not deleted`,
  //     );
  //   }
  // }

  /**
   * Get One account heads
   */
  async findOneHeads(id: number) {
    const data = await this.accountingGroupRepository
      .createQueryBuilder('heads')
      .leftJoinAndMapOne(
        'heads.parent',
        AccountingGroupEntity,
        'parent',
        'heads.groupParent = parent.id',
      )
      .where(`heads.id = ${id}`)
      .getOne();
    if (!data) {
      throw new NotFoundException(`this heads data not exist in db!!`);
    }
    return data;
  }

  // count child
  async countChild(parentId: number) {
    const countChild = await this.accountingGroupRepository
      .createQueryBuilder('child')
      .where(`child.groupParent = ${parentId}`)
      .getCount();

    return countChild ? countChild : 0;
  }
}

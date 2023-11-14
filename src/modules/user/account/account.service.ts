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
import { AccountEntity } from './entities/account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dtos';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: BaseRepository<AccountEntity>,
  ) {}

  //  create account
  async createAccount(
    createAccountDto: CreateAccountDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    createAccountDto['createdBy'] = userPayload.id;

    const insertData = await this.accountRepository.save(createAccountDto);

    return insertData;
  }

  // update account
  async updateAccount(
    updateAccountDto: UpdateAccountDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateAccountDto['updatedAt'] = new Date();
      updateAccountDto['updatedBy'] = userPayload.id;

      const data = await this.accountRepository
        .createQueryBuilder()
        .update(AccountEntity, updateAccountDto)
        .where(`id = '${id}'`)
        .execute();

      return `account updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all account
  async findAllAccount(
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

    const [results, total] = await this.accountRepository
      .createQueryBuilder('account')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`account.accountName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('account.id', 'DESC')
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

  // delete account
  async deleteAccount(id: number): Promise<any> {
    try {
      const account = await this.accountRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!account) {
        throw new NotFoundException('account not found');
      }

      return await this.accountRepository.remove(account);
    } catch (e) {
      throw new BadRequestException(`this account not found. can not deleted`);
    }
  }

  /**
   * Get One account
   */
  async findOneAccount(id: number) {
    const data = await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`this account not exist in db!!`);
    }
    return data;
  }
}

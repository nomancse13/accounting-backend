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
import { ServiceEntity } from './entity';
import { CreateServiceDto, UpdateServiceDto } from './dtos';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ServiceEntity)
    private itemRepository: BaseRepository<ServiceEntity>,
  ) {}

  //  create item
  async createItem(
    createServiceDto: CreateServiceDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    createServiceDto['createdBy'] = userPayload.id;

    const insertData = await this.itemRepository.save(createServiceDto);

    return insertData;
  }

  // update item
  async updateItem(
    updateServiceDto: UpdateServiceDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateServiceDto['updatedAt'] = new Date();
      updateServiceDto['updatedBy'] = userPayload.id;

      const data = await this.itemRepository
        .createQueryBuilder()
        .update(ServiceEntity, updateServiceDto)
        .where(`id = '${id}'`)
        .execute();

      return `item updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all item
  async findAllItem(
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

    const [results, total] = await this.itemRepository
      .createQueryBuilder('item')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`item.serviceName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('item.id', 'DESC')
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

  // delete item
  async deleteItem(id: number): Promise<any> {
    try {
      const item = await this.itemRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!item) {
        throw new NotFoundException('item not found');
      }

      return await this.itemRepository.remove(item);
    } catch (e) {
      throw new BadRequestException(`this item not found. can not deleted`);
    }
  }

  /**
   * Get One item
   */
  async findOneItem(id: number) {
    const data = await this.itemRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`this item not exist in db!!`);
    }
    return data;
  }
}

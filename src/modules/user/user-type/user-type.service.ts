import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { UserTypeEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  CreateUserTypeDto,
  DeleteUserTypeDto,
  UpdateUserTypeDto,
} from '../dtos';
import { UserInterface } from 'src/authentication/common/interfaces';
import slugGenerator from 'src/helper/slugify.helper';
import {
  ErrorMessage,
  StatusField,
  SuccessMessage,
  UserTypesEnum,
} from 'src/authentication/common/enum';
import { decrypt } from 'src/helper/crypto.helper';
import { UserPayload } from 'src/authentication/utils/decorators';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserTypeEntity)
    private userTypeRepository: BaseRepository<UserTypeEntity>,
  ) {}

  /**
   * CREATE new user Type
   */
  async create(userTypeData: CreateUserTypeDto, userPayload: UserInterface) {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    userTypeData['slug'] = slugGenerator(userTypeData.slug);
    userTypeData['createdBy'] = userPayload.id;
    userTypeData['status'] =
      userTypeData && userTypeData.status
        ? userTypeData.status
        : StatusField.ACTIVE;

    const insertData = await this.userTypeRepository.save(userTypeData);
    return insertData;
  }

  /**
   * GET all user type
   */
  async findAll(userPayload: UserInterface) {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    const data = await this.userTypeRepository.find({
      where: {
        status: 'Active',
      },
    });

    if (!data) {
      throw new NotFoundException(ErrorMessage.RECORD_NOT_FOUND);
    }
    return data;
  }

  /**
   * Get One user Type
   */
  async findOneResult(id: number, userPayload: UserInterface) {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    const data = await this.userTypeRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(ErrorMessage.RECORD_NOT_FOUND);
    }
    return data;
  }

  /**
   * Update user type
   */
  async update(
    id: number,
    userTypeData: UpdateUserTypeDto,
    userPayload: UserInterface,
  ) {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    if (userTypeData && userTypeData.slug) {
      userTypeData['slug'] = slugGenerator(userTypeData.slug);
    }
    userTypeData['updatedBy'] = userPayload.id;
    userTypeData['updatedAt'] = new Date();

    const updateData = await this.userTypeRepository
      .createQueryBuilder()
      .update(UserTypeEntity, userTypeData)
      .where('userTypeId = :id', { id: id })
      .execute();

    if (!updateData.affected) {
      throw new NotFoundException(
        `User type data ${ErrorMessage.UPDATE_FAILED}`,
      );
    }

    return `updated successfully!!`;
  }

  /**
   * remove user Type
   */
  async remove(deletedData: DeleteUserTypeDto, userPayload: UserInterface) {
    const deletedInfo = {
      deletedAt: new Date(),
      deletedBy: userPayload.id,
      status: StatusField.INACTIVE,
    };
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }

    //update deleted data
    const deletedResult = await this.userTypeRepository
      .createQueryBuilder()
      .update(UserTypeEntity, deletedInfo)
      .where('userTypeId IN(:...ids)', { ids: deletedData.deleteIds })
      .execute();
    if (!deletedResult.affected) {
      throw new NotFoundException(ErrorMessage.DELETE_FAILED);
    }

    return deletedResult.raw;
  }

  /**
   * Hard delete a User Type
   */
  async delete(id: number, userPayload: UserInterface): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    //update deleted data
    const deletedResult = await this.userTypeRepository.delete({
      id: id,
    });
    if (!deletedResult.affected) {
      throw new NotFoundException(ErrorMessage.DELETE_FAILED);
    }

    return SuccessMessage.DELETE_SUCCESS;
  }

  /**
   * Get One user Type
   */
  async findOneType(id: number) {
    const data = await this.userTypeRepository.findOne({
      where: {
        id: id,
      },
      relations: ['users'],
    });
    if (!data) {
      throw new NotFoundException(`User type not exist in db!!`);
    }
    return data;
  }
}

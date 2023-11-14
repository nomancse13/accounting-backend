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
import { EmployeesEntity } from './entity';
import { DesignationService } from '../designation/designation.service';
import { CreateEmployeesDto, UpdateEmployeesDto } from './dtos';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private employeesRepository: BaseRepository<EmployeesEntity>,
    private readonly designationService: DesignationService,
  ) {}

  //  create Employees
  async createEmployees(
    createEmployeesDto: CreateEmployeesDto,
    userPayload: UserInterface,
  ): Promise<any> {
    // if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
    //   throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    // }
    try {
      const designationInfo = await this.designationService.findOnedesignation(
        createEmployeesDto.designationId,
      );

      createEmployeesDto['createdBy'] = userPayload.id;

      const insertData =
        await this.employeesRepository.save(createEmployeesDto);

      insertData.designation = designationInfo;

      const saveEmployees = await this.employeesRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveEmployees;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update Employees
  async updateEmployees(
    updateEmployeesDto: UpdateEmployeesDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateEmployeesDto['updatedAt'] = new Date();
      updateEmployeesDto['updatedBy'] = userPayload.id;

      const designationInfo = await this.designationService.findOnedesignation(
        updateEmployeesDto.designationId,
      );

      delete updateEmployeesDto.designationId;

      const employeesData = await this.employeesRepository
        .createQueryBuilder()
        .update(EmployeesEntity, updateEmployeesDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.employeesRepository
        .createQueryBuilder('employees')
        .where(`employees.id = ${id}`)
        .getOne();

      dataFind.designation = designationInfo;
      await this.employeesRepository.save(dataFind);

      return `employeesData updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all employees data
  async findAllEmployeesData(
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

    const [results, total] = await this.employeesRepository
      .createQueryBuilder('employees')
      .leftJoinAndSelect('employees.designation', 'designation')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`employees.fullName ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('employees.id', 'DESC')
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

  // delete employees
  async deleteEmployees(id: number): Promise<any> {
    try {
      const employeesData = await this.employeesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!employeesData) {
        throw new NotFoundException('employeesData not found');
      }

      return await this.employeesRepository.remove(employeesData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One employeesData
   */
  async findOneEmployeesData(id: number) {
    const data = await this.employeesRepository.findOne({
      where: {
        id: id,
      },
      relations: ['designation'],
    });
    if (!data) {
      throw new NotFoundException(`employeesData not exist in db!!`);
    }
    return data;
  }
}

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
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
import { SalaryEntity } from './entity';
import { EmployeeService } from '../Employees/employee.service';
import { BankingService } from '../../banking/banking.service';
import { CreateSalaryDto, UpdateSalaryDto } from './dtos';
import { decrypt } from 'src/helper/crypto.helper';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(SalaryEntity)
    private salaryRepository: BaseRepository<SalaryEntity>,
    private readonly employeeService: EmployeeService,
    @Inject(forwardRef(() => BankingService))
    private readonly bankingService: BankingService,
  ) {}

  //  create salary
  async createSalary(
    createSalaryDto: CreateSalaryDto,
    userPayload: UserInterface,
  ): Promise<any> {
    if (decrypt(userPayload.hashType) != UserTypesEnum.USER) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    try {
      const employeeInfo = await this.employeeService.findOneEmployeesData(
        createSalaryDto.employeeId,
      );
      const bankingData = await this.bankingService.findOneBanking(
        createSalaryDto.bankAccountId,
      );

      createSalaryDto['createdBy'] = userPayload.id;

      const insertData = await this.salaryRepository.save(createSalaryDto);

      insertData.employee = employeeInfo;
      insertData.bankAccount = bankingData;

      const saveSalary = await this.salaryRepository.save(insertData);

      // userType.users = [...userType.users, insertData];

      return saveSalary;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.INSERT_FAILED);
    }
  }

  // update salary
  async updateSalary(
    updateSalaryDto: UpdateSalaryDto,
    userPayload: UserInterface,
    id: number,
  ) {
    try {
      updateSalaryDto['updatedAt'] = new Date();
      updateSalaryDto['updatedBy'] = userPayload.id;

      const employeeInfo = await this.employeeService.findOneEmployeesData(
        updateSalaryDto.employeeId,
      );
      const bankingData = await this.bankingService.findOneBanking(
        updateSalaryDto.bankAccountId,
      );

      delete updateSalaryDto.employeeId;
      delete updateSalaryDto.bankAccountId;

      const salaryData = await this.salaryRepository
        .createQueryBuilder()
        .update(SalaryEntity, updateSalaryDto)
        .where(`id = '${id}'`)
        .execute();

      const dataFind = await this.salaryRepository
        .createQueryBuilder('salary')
        .where(`salary.id = ${id}`)
        .getOne();

      dataFind.employee = employeeInfo;
      dataFind.bankAccount = bankingData;
      await this.salaryRepository.save(dataFind);

      return `salaryData updated successfully!!!`;
    } catch (e) {
      throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    }

    // if (data.affected === 0) {
    //   throw new BadRequestException(ErrorMessage.UPDATE_FAILED);
    // }
  }

  // find all salary data
  async findAllSalaryData(
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

    const [results, total] = await this.salaryRepository
      .createQueryBuilder('salary')
      .leftJoinAndSelect('salary.employee', 'employee')
      .leftJoinAndSelect('salary.bankAccount', 'bankAccount')
      .where(
        new Brackets((qb) => {
          if (filter) {
            qb.where(`salary.note ILIKE ('%${filter}%')`);
          }
        }),
      )
      .orderBy('salary.id', 'DESC')
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

  // delete salary
  async deleteSalary(id: number): Promise<any> {
    try {
      const salaryData = await this.salaryRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!salaryData) {
        throw new NotFoundException('salaryData not found');
      }

      return await this.salaryRepository.remove(salaryData);
    } catch (e) {
      throw new BadRequestException(ErrorMessage.DELETE_FAILED);
    }
  }

  /**
   * Get One salaryData
   */
  async findOneSalaryData(id: number) {
    const data = await this.salaryRepository.findOne({
      where: {
        id: id,
      },
      relations: ['employee', 'bankAccount'],
    });
    if (!data) {
      throw new NotFoundException(`salaryData not exist in db!!`);
    }
    return data;
  }
}

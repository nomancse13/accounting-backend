import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationEntity } from './designation/entity';
import { DesignationService } from './designation/designation.service';
import { DesignationController } from './designation/designation.controller';
import { EmployeesEntity } from './Employees/entity';
import { EmployeeController } from './Employees/employee.controller';
import { EmployeeService } from './Employees/employee.service';
import { SalaryEntity } from './salary/entity';
import { SalaryController } from './salary/salary.controller';
import { SalaryService } from './salary/salary.service';
import { UserModule } from '../user.module';

/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DesignationEntity,
      EmployeesEntity,
      SalaryEntity,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [DesignationController, EmployeeController, SalaryController],
  providers: [DesignationService, EmployeeService, SalaryService],
  exports: [DesignationService, EmployeeService, SalaryService],
})
export class HumanResourceModule {}

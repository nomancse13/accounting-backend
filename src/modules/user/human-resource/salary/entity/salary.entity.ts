/**dependencies */
import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeesEntity } from '../../Employees/entity';
import { BankAccountEntity } from 'src/modules/user/banking/entity';

/**common entity data */
@Entity()
export class SalaryEntity extends CommonEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    type: 'text',
  })
  note: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  month: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ManyToOne(() => EmployeesEntity, (employee) => employee.salary, {
    onDelete: 'RESTRICT',
  })
  employee: EmployeesEntity;

  @ManyToOne(() => BankAccountEntity, (bankAccount) => bankAccount.salary, {
    onDelete: 'RESTRICT',
  })
  bankAccount: BankAccountEntity;
}

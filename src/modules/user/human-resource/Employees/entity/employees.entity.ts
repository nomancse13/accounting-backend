/**dependencies */
import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DesignationEntity } from '../../designation/entity';
import { SalaryEntity } from '../../salary/entity';

/**common entity data */
@Entity()
export class EmployeesEntity extends CommonEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ type: 'bigint', nullable: true })
  nationalId: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  mobile: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  presentAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  permanentAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dob: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  joiningDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethod: string;

  @Column({ type: 'bigint' })
  totalSalary: number;

  @Column({ type: 'bigint' })
  pin: number;

  @Column({ type: 'bigint' })
  nhifNumber: number;

  @Column({ type: 'bigint' })
  nssfNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImgSrc: string;

  @ManyToOne(() => DesignationEntity, (designation) => designation.employees, {
    onDelete: 'RESTRICT',
  })
  designation: DesignationEntity;

  @OneToMany(() => SalaryEntity, (salary) => salary.employee)
  salary: SalaryEntity[];
}

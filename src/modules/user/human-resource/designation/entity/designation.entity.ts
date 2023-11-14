import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeesEntity } from '../../Employees/entity';

@Entity()
export class DesignationEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  designationName: string;

  @Column({
    type: 'text',
  })
  note: string;

  @OneToMany(() => EmployeesEntity, (employees) => employees.designation)
  employees: EmployeesEntity[];
}

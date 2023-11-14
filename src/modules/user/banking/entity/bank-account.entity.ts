import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';
import { SalaryEntity } from '../../human-resource/salary/entity';

@Entity()
export class BankAccountEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  accountCode: string;

  @Column({ type: 'varchar', length: 255 })
  bankAccountName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  openingBalance: number;

  @Column({
    type: 'bigint',
  })
  accountType: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.bankings, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.bankings, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @OneToMany(() => SalaryEntity, (salary) => salary.bankAccount)
  salary: SalaryEntity[];
}

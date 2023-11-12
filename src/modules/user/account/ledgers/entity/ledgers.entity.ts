import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { TransactionHistoryEntity } from '../../entities/transaction-history.entity';
import { CurrencyEntity } from '../../entities';
import { BankAccountEntity } from 'src/modules/user/banking/entity';
import { InvoiceEntity } from 'src/modules/user/invoice/entities';

@Entity()
export class LedgersEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ledgerName: string;

  @Column({
    type: 'bigint',
  })
  ledgerParent: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ledgerType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ledgerCode: string;

  @Column({ type: 'varchar', length: 255 })
  nature: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  accountOpeningBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  closingBalance: number;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.ledgers, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @OneToMany(() => UserEntity, (user) => user.ledger)
  users: UserEntity[];

  @OneToMany(() => TransactionHistoryEntity, (th) => th.ledger)
  transactionHistory: TransactionHistoryEntity[];

  @OneToMany(() => BankAccountEntity, (banking) => banking.ledger)
  bankings: BankAccountEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.debitLedger)
  invDebit: InvoiceEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.creditLedger)
  invCredit: InvoiceEntity[];
}

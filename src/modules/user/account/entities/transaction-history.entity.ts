import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LedgersEntity } from '../ledgers/entity';
import { ChartOfAccountsEntity } from './chartofAccounts.entity';

@Entity()
export class TransactionHistoryEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  transactionType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  debit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  credit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  closingBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseAmount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionSource: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionReference: string;

  @Column({
    type: 'bigint',
  })
  referenceID: number;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.transactionHistory, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @ManyToOne(
    () => ChartOfAccountsEntity,
    (account) => account.transactionHistory,
    {
      onDelete: 'RESTRICT',
    },
  )
  account: ChartOfAccountsEntity;
}

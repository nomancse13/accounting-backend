import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

@Entity()
export class InvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  invoiceNo: string;

  @Column({ type: 'varchar', length: 255 })
  transactionID: string;

  @Column({ type: 'varchar', length: 255 })
  comment: string;

  @Column({ type: 'timestamp', nullable: true, default: () => 'NOW()' })
  invoiceDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  creditAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reverseRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  debitCurrencyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditCurrencyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchaseAverageRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  debitRateBase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditRateBase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalDueAmount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentStatus: string;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.invDebit, {
    onDelete: 'RESTRICT',
  })
  debitLedger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.invCredit, {
    onDelete: 'RESTRICT',
  })
  creditLedger: LedgersEntity;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.invDebitCurr, {
    onDelete: 'RESTRICT',
  })
  debitCurrencies: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.invCreditCurr, {
    onDelete: 'RESTRICT',
  })
  creditCurrencies: CurrencyEntity;
}

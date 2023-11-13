import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

@Entity()
export class SalesEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  cashSaleNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionID: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'varchar', length: 255 })
  comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payementStatus: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  saleAmount: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  cashSaleDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reverseRate: number;

  @ManyToOne(
    () => CurrencyEntity,
    (paidcurrencies) => paidcurrencies.paidSales,
    {
      onDelete: 'RESTRICT',
    },
  )
  paidcurrencies: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, (salecurrencies) => salecurrencies.sales, {
    onDelete: 'RESTRICT',
  })
  salecurrencies: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (debitledger) => debitledger.salesDebit, {
    onDelete: 'RESTRICT',
  })
  debitledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (salesledger) => salesledger.sales, {
    onDelete: 'RESTRICT',
  })
  salesledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (bankledger) => bankledger.salesBank, {
    onDelete: 'RESTRICT',
  })
  bankledger: LedgersEntity;
}

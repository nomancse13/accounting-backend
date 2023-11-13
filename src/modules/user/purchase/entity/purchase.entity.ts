import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

@Entity()
export class PurchaseEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  cashPurchaseNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionID: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payementStatus: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  purchaseAmount: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  purhaseSaleDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  reverseRate: number;

  @ManyToOne(
    () => CurrencyEntity,
    (paidcurrencies) => paidcurrencies.paidPurchase,
    {
      onDelete: 'RESTRICT',
    },
  )
  paidcurrencies: CurrencyEntity;

  @ManyToOne(
    () => CurrencyEntity,
    (purchasecurrencies) => purchasecurrencies.purchase,
    {
      onDelete: 'RESTRICT',
    },
  )
  purchasecurrencies: CurrencyEntity;

  @ManyToOne(
    () => LedgersEntity,
    (supplierledger) => supplierledger.purchaseSupply,
    {
      onDelete: 'RESTRICT',
    },
  )
  supplierledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (purchaseledger) => purchaseledger.purchase, {
    onDelete: 'RESTRICT',
  })
  purchaseledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (bankledger) => bankledger.purchaseBank, {
    onDelete: 'RESTRICT',
  })
  bankledger: LedgersEntity;
}

import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleVoucherEntity } from '../../sale-voucher/entity';
import { CurrencyEntity } from 'src/modules/user/account/entities';
import { LedgersEntity } from 'src/modules/user/account/ledgers/entity';

@Entity()
export class CustomersEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  customerCode: string;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPersons: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.customers, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.customers, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.customerSupply, {
    onDelete: 'RESTRICT',
  })
  supplierledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.customersLedger1, {
    onDelete: 'RESTRICT',
  })
  customerledger1: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.customersLedger2, {
    onDelete: 'RESTRICT',
  })
  customerledger2: LedgersEntity;

  @OneToMany(() => SaleVoucherEntity, (sales) => sales.customer)
  sales: SaleVoucherEntity[];
}

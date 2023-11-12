import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

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

  @ManyToOne(() => CurrencyEntity, (currency) => currency.bankings, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.bankings, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.bankings, {
    onDelete: 'RESTRICT',
  })
  supplierledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.bankings, {
    onDelete: 'RESTRICT',
  })
  customerledger1: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.bankings, {
    onDelete: 'RESTRICT',
  })
  customerledger2: LedgersEntity;
}

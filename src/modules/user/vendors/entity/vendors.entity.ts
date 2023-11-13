import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

@Entity()
export class VendorsEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  vendorCode: string;

  @Column({ type: 'varchar', length: 255 })
  vendorName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPersons: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.vendors, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.vendors, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (customerledger) => customerledger.vendors, {
    onDelete: 'RESTRICT',
  })
  customerledger: LedgersEntity;

  @ManyToOne(
    () => LedgersEntity,
    (supplierledger1) => supplierledger1.vendors,
    {
      onDelete: 'RESTRICT',
    },
  )
  supplierledger1: LedgersEntity;

  @ManyToOne(
    () => LedgersEntity,
    (supplierledger2) => supplierledger2.vendors,
    {
      onDelete: 'RESTRICT',
    },
  )
  supplierledger2: LedgersEntity;
}

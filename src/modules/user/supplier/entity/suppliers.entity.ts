import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../account/entities';
import { LedgersEntity } from '../../account/ledgers/entity';

@Entity()
export class SuppliersEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  bothCode: string;

  @Column({ type: 'varchar', length: 255 })
  bothName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPersons: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.supplierCurrency, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.supplierLedger, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;
}

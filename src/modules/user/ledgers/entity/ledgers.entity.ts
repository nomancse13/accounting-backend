import { CommonEntity } from 'src/authentication/common';
import {
  SubscriptionStatusEnum,
  UserTypesEnum,
} from 'src/authentication/common/enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyEntity } from '../../currency/entity';

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

  @ManyToOne(() => CurrencyEntity, (currency) => currency.ledgers)
  currency: CurrencyEntity;
}

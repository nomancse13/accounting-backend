import { CommonEntity } from 'src/authentication/common';
import {
  SubscriptionStatusEnum,
  UserTypesEnum,
} from 'src/authentication/common/enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LedgersEntity } from '../../ledgers/entity';
import { UserEntity } from '../../entities';

@Entity()
export class CurrencyEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  currencyName: string;

  @Column({
    type: 'bigint',
  })
  decimalPlaces: number;

  @Column({ type: 'varchar', length: 255 })
  currencySymbol: string;

  @Column({ type: 'bool', default: false })
  public sendAutoEmail: boolean;

  @Column({ type: 'bool', default: true })
  public baseCurrency: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  closingBalance: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'NOW()' })
  executionDate: Date;

  @OneToMany(() => LedgersEntity, (ledger) => ledger.currency)
  ledgers: LedgersEntity[];

  @OneToMany(() => UserEntity, (user) => user.currency)
  users: UserEntity[];
}

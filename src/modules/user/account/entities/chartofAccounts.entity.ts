import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { LedgersEntity } from '../ledgers/entity';
import { TransactionHistoryEntity } from './transaction-history.entity';

@Entity()
export class ChartOfAccountsEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  accountName: string;

  @Column({
    type: 'bigint',
  })
  groupParent: number;

  @Column({ type: 'varchar', length: 255 })
  nature: string;

  @OneToMany(() => TransactionHistoryEntity, (th) => th.account)
  transactionHistory: TransactionHistoryEntity[];
}

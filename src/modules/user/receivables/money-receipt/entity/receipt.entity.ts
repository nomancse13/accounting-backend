import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomersEntity } from '../../customers/entity';
import { AccountEntity } from 'src/modules/user/account/entities/account.entity';

@Entity()
export class ReceiptEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  voucher: string;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @Column({ type: 'bigint' })
  dueAmount: number;

  @Column({ type: 'bigint', nullable: true })
  transactionNo: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethod: string;

  @Column({ type: 'varchar', nullable: true })
  refDoc: string;

  @Column({ type: 'text', nullable: true })
  narration: string;

  @ManyToOne(() => CustomersEntity, (customer) => customer.receipts, {
    onDelete: 'RESTRICT',
  })
  customer: CustomersEntity;

  @ManyToOne(() => AccountEntity, (account) => account.receipts, {
    onDelete: 'RESTRICT',
  })
  account: AccountEntity;
}

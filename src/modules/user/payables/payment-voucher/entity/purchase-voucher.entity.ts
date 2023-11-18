import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from 'src/modules/user/account/entities/account.entity';
import { SuppliersEntity } from '../../supplier/entity';

@Entity()
export class PurchaseVoucherEntity extends CommonEntity {
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
  amount: number;

  @Column({ type: 'bigint', nullable: true })
  recNo: number;

  @Column({ type: 'varchar', nullable: true })
  refDoc: string;

  @Column({ type: 'text', nullable: true })
  narration: string;

  @ManyToOne(() => SuppliersEntity, (supplier) => supplier.puchaseVoucher, {
    onDelete: 'RESTRICT',
  })
  supplier: SuppliersEntity;

  @ManyToOne(() => AccountEntity, (account) => account.receipts, {
    onDelete: 'RESTRICT',
  })
  account: AccountEntity;
}

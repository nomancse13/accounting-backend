import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SuppliersEntity } from '../../supplier/entity';

@Entity()
export class PurchaseRetrunEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  voucher: string;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @Column({ type: 'bigint' })
  returnAmount: number;

  @Column({ type: 'bigint' })
  recNo: number;

  @Column({ type: 'text', nullable: true })
  carrier: string;

  @ManyToOne(() => SuppliersEntity, (supplier) => supplier.purchaseReturn, {
    onDelete: 'RESTRICT',
  })
  supplier: SuppliersEntity;
}

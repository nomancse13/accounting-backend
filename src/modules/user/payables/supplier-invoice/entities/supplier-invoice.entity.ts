import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SuppliersEntity } from '../../supplier/entity';

@Entity()
export class SupplierInvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invoiceNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  invoiceDate: Date;

  @Column({ type: 'varchar', nullable: true })
  fileSrc: string;

  @Column({ type: 'boolean', default: true })
  vat: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  items: any;

  @ManyToOne(() => SuppliersEntity, (supplier) => supplier.invoice, {
    onDelete: 'RESTRICT',
  })
  supplier: SuppliersEntity;
}

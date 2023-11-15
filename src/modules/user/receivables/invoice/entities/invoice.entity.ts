import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomersEntity } from '../../customers/entity';

@Entity()
export class InvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invoiceNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  comment: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  month: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  invoiceDate: Date;

  @Column({ type: 'varchar', nullable: true })
  fileSrc: string;

  @Column({ type: 'boolean', default: true })
  vat: string;

  @Column({ type: 'bigint', default: true })
  subtotal: number;

  @Column({ type: 'bigint', default: true })
  total: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  items: any;

  @ManyToOne(() => CustomersEntity, (customer) => customer.invoice, {
    onDelete: 'RESTRICT',
  })
  customer: CustomersEntity;
}

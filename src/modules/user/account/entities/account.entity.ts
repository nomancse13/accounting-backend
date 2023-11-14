import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReceiptEntity } from '../../receivables/money-receipt/entity';

@Entity()
export class AccountEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nature: string;

  @Column({ type: 'bigint', nullable: true })
  parentId: number;

  @OneToMany(() => ReceiptEntity, (receipts) => receipts.customer)
  receipts: ReceiptEntity[];
}

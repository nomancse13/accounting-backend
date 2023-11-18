import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LedgersEntity } from 'src/modules/user/account/ledgers/entity';

@Entity()
export class ExpensesEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  voucher: string;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  expenseAmount: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'varchar', nullable: true })
  refDoc: string;

  @ManyToOne(() => LedgersEntity, (ledgerExpense) => ledgerExpense.expense, {
    onDelete: 'RESTRICT',
  })
  ledgerExpense: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (ledgerPaid) => ledgerPaid.paid, {
    onDelete: 'RESTRICT',
  })
  ledgerPaid: LedgersEntity;
}

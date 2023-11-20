import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LedgersEntity } from '../../ledgers/entity';

@Entity()
export class ManualJournalsEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  voucher: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  date: string;

  @Column({ type: 'varchar', length: 255 })
  narration: string;

  @Column({ type: 'varchar', nullable: true })
  fileSrc: string;

  @Column({ type: 'bigint', default: true })
  recNo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditAmount: number;

  @ManyToOne(() => LedgersEntity, (debit) => debit.debitJournal, {
    onDelete: 'RESTRICT',
  })
  debit: LedgersEntity;

  @ManyToOne(() => LedgersEntity, (credit) => credit.creditJournal, {
    onDelete: 'RESTRICT',
  })
  credit: LedgersEntity;
}

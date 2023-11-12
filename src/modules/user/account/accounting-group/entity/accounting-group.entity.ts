import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountingGroupEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  groupName: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  groupParent: number;

  @Column({ type: 'varchar', length: 255 })
  groupIdentifier: string;

  @Column({ type: 'varchar', length: 255 })
  groupType: string;

  @Column({ type: 'varchar', length: 255 })
  nature: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  postedTo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  groupHeadType: string;
}

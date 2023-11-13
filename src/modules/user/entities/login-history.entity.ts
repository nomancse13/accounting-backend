import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class LoginHistoryEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  accessTime: Date;

  @Column({ type: 'varchar', length: 255 })
  cLientIPAddress: string;

  @Column({ type: 'varchar', length: 255 })
  browser: string;

  @Column({ type: 'varchar', length: 255 })
  os: string;

  @Column({ type: 'varchar', length: 255 })
  accessType: string;

  @ManyToOne(() => UserEntity, (user) => user.login, {
    onDelete: 'RESTRICT',
  })
  user: UserEntity;
}

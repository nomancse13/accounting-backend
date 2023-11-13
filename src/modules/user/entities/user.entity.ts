/**dependencies */
import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserTypeEntity } from './user-type.entity';
import { LedgersEntity } from '../account/ledgers/entity';
import { CurrencyEntity } from '../account/entities';
import { DeviceHistoryEntity } from './devices-history.entity';
import { LoginHistoryEntity } from './login-history.entity';
/**common entity data */
@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hashedRt: string;

  // @Column({ type: 'varchar', length: 255, default: UserTypesEnum.USER })
  // userType: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImgSrc: string;

  @Column({ type: 'varchar', length: '255', nullable: true, select: false })
  passResetToken: string;

  @Column({ type: 'timestamp', select: false })
  passResetTokenExpireAt: Date;

  @Column({ type: 'uuid', nullable: true })
  uniqueId: string;

  @ManyToOne(() => UserTypeEntity, (userType) => userType.users, {
    onDelete: 'RESTRICT',
  })
  userType: UserTypeEntity;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.users, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.users, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @OneToMany(() => DeviceHistoryEntity, (devices) => devices.user)
  devices: DeviceHistoryEntity[];

  @OneToMany(() => LoginHistoryEntity, (login) => login.user)
  login: LoginHistoryEntity[];
}

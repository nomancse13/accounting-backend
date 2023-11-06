/**dependencies */
import { CommonEntity } from 'src/authentication/common';
import { UserTypesEnum } from 'src/authentication/common/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'varchar', length: 255, default: UserTypesEnum.USER })
  userType: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImgSrc: string;

  @Column({ type: 'varchar', length: '255', nullable: true, select: false })
  passResetToken: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passResetTokenExpireAt: Date;

  @Column({ type: 'uuid', nullable: true })
  uniqueId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserTypeEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'Primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  userTypeName: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @OneToMany(() => UserEntity, (user) => user.userType)
  users: UserEntity[];
}

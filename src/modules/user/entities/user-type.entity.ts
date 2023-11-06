import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

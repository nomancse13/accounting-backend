import { CommonEntity } from 'src/authentication/common';
import {
  SubscriptionStatusEnum,
  UserTypesEnum,
} from 'src/authentication/common/enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../currency/entity';
import { UserEntity } from '../../entities';

@Entity()
export class OrganizationsEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  organisationName: string;

  @Column({ type: 'varchar', length: 255 })
  organisationType: string;

  @Column({ type: 'varchar', length: 255 })
  organizationLogo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  licenseExpired: string;
}

import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

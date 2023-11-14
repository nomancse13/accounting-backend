import { CommonEntity } from 'src/authentication/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  serviceName: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  buyingPrice: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  sellingPrice: number;
}

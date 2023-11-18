import { CommonEntity } from 'src/authentication/common';
import { CurrencyEntity } from 'src/modules/user/account/entities';
import { LedgersEntity } from 'src/modules/user/account/ledgers/entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierInvoiceEntity } from '../../supplier-invoice/entities';
import { PaymentVoucherEntity } from '../../payment-voucher/entity';
import { PurchaseRetrunEntity } from '../../purchase/entity';

@Entity()
export class SuppliersEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  bothCode: string;

  @Column({ type: 'varchar', length: 255 })
  bothName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPersons: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.supplierCurrency, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @ManyToOne(() => LedgersEntity, (ledger) => ledger.supplierLedger, {
    onDelete: 'RESTRICT',
  })
  ledger: LedgersEntity;

  @OneToMany(() => SupplierInvoiceEntity, (invoice) => invoice.supplier)
  invoice: SupplierInvoiceEntity[];

  @OneToMany(
    () => PaymentVoucherEntity,
    (paymentVoucher) => paymentVoucher.supplier,
  )
  paymentVoucher: PaymentVoucherEntity[];

  @OneToMany(
    () => PurchaseRetrunEntity,
    (purchaseReturn) => purchaseReturn.supplier,
  )
  purchaseReturn: PurchaseRetrunEntity[];
}

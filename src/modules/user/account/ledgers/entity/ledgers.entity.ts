import { CommonEntity } from 'src/authentication/common';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { TransactionHistoryEntity } from '../../entities/transaction-history.entity';
import { CurrencyEntity } from '../../entities';
import { BankAccountEntity } from 'src/modules/user/banking/entity';
import { VendorsEntity } from 'src/modules/user/vendors/entity';
import { PurchaseEntity } from 'src/modules/user/purchase/entity';
import { SalesEntity } from 'src/modules/user/sales/entity';
import { CustomersEntity } from 'src/modules/user/receivables/customers/entity';
import { InvoiceEntity } from 'src/modules/user/receivables/invoice/entities';
import { SuppliersEntity } from 'src/modules/user/payables/supplier/entity';
import { ExpensesEntity } from 'src/modules/user/payables/expenses/entity';
import { ManualJournalsEntity } from '../../manual-journal/entities';

@Entity()
export class LedgersEntity extends CommonEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    comment: 'primary id for the table',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ledgerName: string;

  @Column({
    type: 'bigint',
  })
  ledgerParent: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ledgerType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ledgerCode: string;

  @Column({ type: 'varchar', length: 255 })
  nature: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  accountOpeningBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  closingBalance: number;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.ledgers, {
    onDelete: 'RESTRICT',
  })
  currency: CurrencyEntity;

  @OneToMany(() => UserEntity, (user) => user.ledger)
  users: UserEntity[];

  @OneToMany(() => TransactionHistoryEntity, (th) => th.ledger)
  transactionHistory: TransactionHistoryEntity[];

  @OneToMany(() => BankAccountEntity, (banking) => banking.ledger)
  bankings: BankAccountEntity[];

  // @OneToMany(() => InvoiceEntity, (invoice) => invoice.debitLedger)
  // invDebit: InvoiceEntity[];

  // @OneToMany(() => InvoiceEntity, (invoice) => invoice.creditLedger)
  // invCredit: InvoiceEntity[];

  @OneToMany(() => VendorsEntity, (vendors) => vendors.ledger)
  vendors: VendorsEntity[];

  @OneToMany(
    () => VendorsEntity,
    (vendorsCustom) => vendorsCustom.customerledger,
  )
  vendorsCustom: VendorsEntity[];

  @OneToMany(
    () => VendorsEntity,
    (vendorsSupplier1) => vendorsSupplier1.supplierledger1,
  )
  vendorsSupplier1: VendorsEntity[];

  @OneToMany(
    () => VendorsEntity,
    (vendorsSupplier2) => vendorsSupplier2.supplierledger2,
  )
  vendorsSupplier2: VendorsEntity[];

  @OneToMany(
    () => PurchaseEntity,
    (purchaseSupply) => purchaseSupply.supplierledger,
  )
  purchaseSupply: PurchaseEntity[];

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.purchaseledger)
  purchase: PurchaseEntity[];

  @OneToMany(() => PurchaseEntity, (purchaseBank) => purchaseBank.bankledger)
  purchaseBank: PurchaseEntity[];

  @OneToMany(() => SalesEntity, (salesDebit) => salesDebit.debitledger)
  salesDebit: SalesEntity[];

  @OneToMany(() => SalesEntity, (sales) => sales.salesledger)
  sales: SalesEntity[];

  @OneToMany(() => SalesEntity, (salesBank) => salesBank.bankledger)
  salesBank: SalesEntity[];

  @OneToMany(() => SuppliersEntity, (supplierLedger) => supplierLedger.ledger)
  supplierLedger: SuppliersEntity[];

  @OneToMany(() => CustomersEntity, (customers) => customers.ledger)
  customers: CustomersEntity[];

  @OneToMany(
    () => CustomersEntity,
    (customerSupply) => customerSupply.supplierledger,
  )
  customerSupply: CustomersEntity[];

  @OneToMany(
    () => CustomersEntity,
    (customersLedger1) => customersLedger1.customerledger1,
  )
  customersLedger1: CustomersEntity[];

  @OneToMany(
    () => CustomersEntity,
    (customersLedger2) => customersLedger2.customerledger2,
  )
  customersLedger2: CustomersEntity[];

  @OneToMany(() => ExpensesEntity, (expense) => expense.ledgerExpense)
  expense: ExpensesEntity[];

  @OneToMany(() => ExpensesEntity, (paid) => paid.ledgerPaid)
  paid: ExpensesEntity[];

  @OneToMany(() => ManualJournalsEntity, (debitJournal) => debitJournal.debit)
  debitJournal: ManualJournalsEntity[];

  @OneToMany(
    () => ManualJournalsEntity,
    (creditJournal) => creditJournal.credit,
  )
  creditJournal: ManualJournalsEntity[];
}

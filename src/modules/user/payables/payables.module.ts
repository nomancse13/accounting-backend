import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersEntity } from './supplier/entity';
import { SuppliersController } from './supplier/suppliers.controller';
import { SuppliersService } from './supplier/suppliers.service';
import { AccountModule } from '../account/account.module';
import { SupplierInvoiceEntity } from './supplier-invoice/entities';
import { SupplierInvoiceController } from './supplier-invoice/supplier-invoice.controller';
import { SupplierInvoiceService } from './supplier-invoice/supplier-invoice.service';
import { PaymentVoucherEntity } from './payment-voucher/entity';
import { PaymentVoucherController } from './payment-voucher/payment-voucher.controller';
import { PaymentVoucherService } from './payment-voucher/payment-voucher.service';
import { PurchaseRetrunEntity } from './purchase/entity';
import { PurchaseReturnController } from './purchase/purchase-return.controller';
import { PurchaseReturnService } from './purchase/purchase-return.service';
import { ExpensesEntity } from './expenses/entity';
import { ExpensesController } from './expenses/expenses.controller';
import { ExpensesService } from './expenses/expenses.service';
import { LsoLpoEntity } from './lso-lpo/entities';
import { LsoLpoController } from './lso-lpo/lso-lpo.controller';
import { LsoLpoService } from './lso-lpo/lso-lpo.service';

/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuppliersEntity,
      SupplierInvoiceEntity,
      PaymentVoucherEntity,
      PurchaseRetrunEntity,
      ExpensesEntity,
      LsoLpoEntity,
    ]),
    AccountModule,
  ],
  controllers: [
    SuppliersController,
    SupplierInvoiceController,
    PaymentVoucherController,
    PurchaseReturnController,
    ExpensesController,
    LsoLpoController,
  ],
  providers: [
    SuppliersService,
    SupplierInvoiceService,
    PaymentVoucherService,
    PurchaseReturnService,
    ExpensesService,
    LsoLpoService,
  ],
  exports: [SuppliersService],
})
export class PayablesModule {}

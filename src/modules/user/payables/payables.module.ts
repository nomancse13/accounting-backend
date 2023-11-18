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

/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuppliersEntity,
      SupplierInvoiceEntity,
      PaymentVoucherEntity,
    ]),
    AccountModule,
  ],
  controllers: [
    SuppliersController,
    SupplierInvoiceController,
    PaymentVoucherController,
  ],
  providers: [SuppliersService, SupplierInvoiceService, PaymentVoucherService],
  exports: [SuppliersService],
})
export class PayablesModule {}

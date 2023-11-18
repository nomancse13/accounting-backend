import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersEntity } from './supplier/entity';
import { SuppliersController } from './supplier/suppliers.controller';
import { SuppliersService } from './supplier/suppliers.service';
import { AccountModule } from '../account/account.module';
import { SupplierInvoiceEntity } from './supplier-invoice/entities';
import { SupplierInvoiceController } from './supplier-invoice/supplier-invoice.controller';
import { SupplierInvoiceService } from './supplier-invoice/supplier-invoice.service';
import { PurchaseVoucherEntity } from './payment-voucher/entity';
import { PurchaseVoucherController } from './payment-voucher/purchase-voucher.controller';
import { PurchaseVoucherService } from './payment-voucher/purchase-voucher.service';
/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuppliersEntity,
      SupplierInvoiceEntity,
      PurchaseVoucherEntity,
    ]),
    AccountModule,
  ],
  controllers: [
    SuppliersController,
    SupplierInvoiceController,
    PurchaseVoucherController,
  ],
  providers: [SuppliersService, SupplierInvoiceService, PurchaseVoucherService],
  exports: [SuppliersService],
})
export class PayablesModule {}

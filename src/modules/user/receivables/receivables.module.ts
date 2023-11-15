import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user.module';
import { SaleVoucherEntity } from './sale-voucher/entity';
import { SaleVoucherController } from './sale-voucher/sale-voucher.controller';
import { SaleVoucherService } from './sale-voucher/sale-voucher.service';
import { CustomersEntity } from './customers/entity';
import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';
import { AccountModule } from '../account/account.module';
import { ReceiptEntity } from './money-receipt/entity';
import { ReceiptController } from './money-receipt/receipt.controller';
import { ReceiptService } from './money-receipt/receipt.service';
import { InvoiceEntity } from './invoice/entities';
import { InvoiceController } from './invoice/invoice.controller';
import { InvoiceService } from './invoice/invoice.service';

/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleVoucherEntity,
      CustomersEntity,
      ReceiptEntity,
      InvoiceEntity,
    ]),
    forwardRef(() => UserModule),
    AccountModule,
  ],
  controllers: [
    InvoiceController,
    SaleVoucherController,
    CustomersController,
    ReceiptController,
  ],
  providers: [
    InvoiceService,
    SaleVoucherService,
    CustomersService,
    ReceiptService,
  ],
  exports: [SaleVoucherService, CustomersService, ReceiptService],
})
export class ReceivablesModule {}

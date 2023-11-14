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

/**Module */
@Module({
  imports: [
    TypeOrmModule.forFeature([SaleVoucherEntity, CustomersEntity]),
    forwardRef(() => UserModule),
    AccountModule,
  ],
  controllers: [SaleVoucherController, CustomersController],
  providers: [SaleVoucherService, CustomersService],
  exports: [SaleVoucherService, CustomersService],
})
export class ReceivablesModule {}

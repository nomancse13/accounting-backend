/**dependencies */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authentication/auth/auth.module';
import { QueueMailModule } from '../queue-mail/queue-mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  CalenderDataEntity,
  DeviceHistoryEntity,
  LoginHistoryEntity,
  UserTypeEntity,
} from './entities';
import { UserTypeController } from './user-type/user-type.controller';
import { UserTypeService } from './user-type/user-type.service';
import { AccountModule } from './account/account.module';
import { BankAccountEntity } from './banking/entity';
import { BankingController } from './banking/banking.controller';
import { BankingService } from './banking/banking.service';
import { OrganizationsEntity } from './configurations/organizations/entity';
import { OrganizationsController } from './configurations/organizations/organizations.controller';
import { OrganizationsService } from './configurations/organizations/organizations.service';
import { MailConfigurationsEntity } from './configurations/entities/mailConfigurations.entity';
import { CountryEntity } from './configurations/entities/country.entity';
import { SuppliersEntity } from './supplier/entity';
import { SuppliersController } from './supplier/suppliers.controller';
import { SuppliersService } from './supplier/suppliers.service';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceController } from './invoice/invoice.controller';
import { InvoiceEntity } from './invoice/entities';
import { VendorsController } from './vendors/vendors.controller';
import { VendorsService } from './vendors/vendors.service';
import { VendorsEntity } from './vendors/entity';
import { PurchaseEntity } from './purchase/entity';
import { PurchaseController } from './purchase/purchase.controller';
import { PurchaseService } from './purchase/purchase.service';
import { SalesEntity } from './sales/entity';
import { SalesController } from './sales/sales.controller';
import { SalesService } from './sales/sales.service';
import { HumanResourceModule } from './human-resource/human-resource.module';
import { ServiceEntity } from './service/entity';
import { ServiceController } from './service/service.controller';
import { ItemService } from './service/item.service';
import { ReceivablesModule } from './receivables/receivables.module';
/**controllers */
/**Authentication strategies */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeEntity,
      OrganizationsEntity,
      BankAccountEntity,
      MailConfigurationsEntity,
      CountryEntity,
      SuppliersEntity,
      InvoiceEntity,
      VendorsEntity,
      CalenderDataEntity,
      DeviceHistoryEntity,
      LoginHistoryEntity,
      PurchaseEntity,
      SalesEntity,
      ServiceEntity,
    ]),
    QueueMailModule,
    AccountModule,
    HumanResourceModule,
    ReceivablesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [
    UserController,
    UserTypeController,
    OrganizationsController,
    BankingController,
    SuppliersController,
    InvoiceController,
    VendorsController,
    PurchaseController,
    SalesController,
    ServiceController,
  ],
  providers: [
    UserService,
    UserTypeService,
    OrganizationsService,
    BankingService,
    SuppliersService,
    InvoiceService,
    VendorsService,
    PurchaseService,
    SalesService,
    ItemService,
  ],
  exports: [UserService, UserTypeService, BankingService],
})
export class UserModule {}

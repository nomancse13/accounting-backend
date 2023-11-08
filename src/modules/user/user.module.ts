/**dependencies */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authentication/auth/auth.module';
import { QueueMailModule } from '../queue-mail/queue-mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity, UserTypeEntity } from './entities';
import { UserTypeController } from './user-type/user-type.controller';
import { UserTypeService } from './user-type/user-type.service';
import { LedgersEntity } from './ledgers/entity';
import { LedgersService } from './ledgers/ledgers.service';
import { LedgerController } from './ledgers/ledgers.controller';
import { CurrencyEntity } from './currency/entity';
import { OrganizationsService } from './organization/organizations.service';
import { OrganizationsController } from './organization/organizations.controller';
import { OrganizationsEntity } from './organization/entity';
import { AccountingGroupEntity } from './accounting-group/entity';
/**controllers */
/**Authentication strategies */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserTypeEntity,
      LedgersEntity,
      CurrencyEntity,
      OrganizationsEntity,
      AccountingGroupEntity,
    ]),
    QueueMailModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [
    UserController,
    UserTypeController,
    LedgerController,
    OrganizationsController,
  ],
  providers: [
    UserService,
    UserTypeService,
    LedgersService,
    OrganizationsService,
  ],
  exports: [UserService, UserTypeService, LedgersService],
})
export class UserModule {}

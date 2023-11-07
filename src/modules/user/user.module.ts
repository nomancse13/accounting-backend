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
/**controllers */
/**Authentication strategies */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserTypeEntity,
      LedgersEntity,
      CurrencyEntity,
    ]),
    QueueMailModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, UserTypeController, LedgerController],
  providers: [UserService, UserTypeService, LedgersService],
  exports: [UserService, UserTypeService],
})
export class UserModule {}

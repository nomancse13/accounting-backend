/**dependencies */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgersEntity } from './ledgers/entity';
import { LedgersService } from './ledgers/ledgers.service';
import { LedgerController } from './ledgers/ledgers.controller';
import { AccountingGroupEntity } from './accounting-group/entity';
import { AccountingGroupController } from './accounting-group/accounting-group.controller';
import { AccountingGroupService } from './accounting-group/accounting-group.service';
import { QueueMailModule } from 'src/modules/queue-mail/queue-mail.module';
import { AuthModule } from 'src/authentication/auth/auth.module';
import {
  ChartOfAccountsEntity,
  CurrencyEntity,
  PrefixEntity,
  TransactionHistoryEntity,
} from './entities';
import { AccountEntity } from './entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ManualJournalsService } from './manual-journal/manual-journals.service';
import { ManualJournalsController } from './manual-journal/manual-journals.controller';
import { ManualJournalsEntity } from './manual-journal/entities';
import { AccountHeadsController } from './account-heads/account-heads.controller';
import { AccountHeadsService } from './account-heads/account-heads.service';
/**controllers */
/**Authentication strategies */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LedgersEntity,
      CurrencyEntity,
      AccountingGroupEntity,
      TransactionHistoryEntity,
      ChartOfAccountsEntity,
      PrefixEntity,
      AccountEntity,
      ManualJournalsEntity,
    ]),
    forwardRef(() => AuthModule),
    QueueMailModule,
  ],
  controllers: [
    LedgerController,
    AccountingGroupController,
    AccountController,
    ManualJournalsController,
    AccountHeadsController,
  ],
  providers: [
    LedgersService,
    AccountingGroupService,
    AccountService,
    ManualJournalsService,
    AccountHeadsService,
  ],
  exports: [LedgersService, AccountService],
})
export class AccountModule {}

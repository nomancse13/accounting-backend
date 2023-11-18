import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './authentication/auth/config/env.validation';
import {
  TypeOrmConfigModule,
  TypeOrmConfigService,
} from './authentication/auth/config/typeorm-config';
import { LoggerMiddleware } from './authentication/middleware';
import { QueueMailConsumer } from './modules/queue-mail/queue-mail.consumer';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/user/account/account.module';
import { HumanResourceModule } from './modules/user/human-resource/human-resource.module';
import { ReceivablesModule } from './modules/user/receivables/receivables.module';
import { PayablesModule } from './modules/user/payables/payables.module';

@Module({
  imports: [
    /**initialize nest js config module */
    ConfigModule.forRoot({
      validate: validate,
      //responsible for use config values globally
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    // Typeorm initialize
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [ConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the ConnectionOptions.
      name: TypeOrmConfigService.connectionName,
      useExisting: TypeOrmConfigService,
      // connectionFactory receives the configured ConnectionOptions
      // and returns a Promise<Connection>.
      // dataSourceFactory: async (options) => {
      //   const connection = await createConnection(options);
      //   return connection;
      // },
    }),
    //module prefix for modules
    RouterModule.register([
      //module prefix for user
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'user',
        module: AccountModule,
      },
      {
        path: 'user',
        module: HumanResourceModule,
      },
      {
        path: 'user',
        module: ReceivablesModule,
      },
      {
        path: 'user',
        module: PayablesModule,
      },
    ]),
    MulterModule.register({ dest: './uploads', storage: './uploads' }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, QueueMailConsumer],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

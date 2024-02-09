import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommandsModule } from './commands/commands.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

@Module({
  imports: [
    CustomersModule,
    ServicesModule,
    CommandsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_URL: joi.string().required(),
        PORT: joi.number().required(),
        AXIOS_TIMEOUT: joi.number().required(),
        SMS_API_BASE_URL: joi.string().required(),
        SMS_API_KEY: joi.string().required(),
        TWOFA_APPLICATION_ID: joi.string().required(),
        TWOFA_MESSAGE_TEMPLATE_ID: joi.string().required(),
        APP_NAME: joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

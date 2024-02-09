import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommandsModule } from './commands/commands.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    CustomersModule,
    ServicesModule,
    CommandsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        OTP_TTL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

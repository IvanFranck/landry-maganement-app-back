import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('AXIOS_TIMEOUT'),
        baseURL: configService.get('SMS_API_BASE_URL'),
        auth: {
          username: configService.get('TWILIO_VERIFY_API_AUTH_KEY'),
          password: configService.get('TWILIO_VERIFY_API_SERVICE_ID'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}

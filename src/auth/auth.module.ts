import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule],
  providers: [PrismaService, AuthService, LocalStrategy],
})
export class AuthModule {}

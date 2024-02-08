import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [CustomersModule, ServicesModule, CommandsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

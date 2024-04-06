import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CommissionsService } from './commissions.service';
import { DefaultPriceHandler } from './handlers/commission/default-price.handler';
import { ClientDiscountHandler } from './handlers/commission/client-discount.handler';
import { HighTurnoverDiscountHandler } from './handlers/commission/high-turnover-discount.handler';
import { ExchangeRatesService } from './exchange-rates.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule } from '../clients/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('EXCHANGE_RATE_API_HOSTNAME'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CommissionsService,
    DefaultPriceHandler,
    HighTurnoverDiscountHandler,
    ClientDiscountHandler,
    ExchangeRatesService,
  ],
})
export class TransactionsModule {}

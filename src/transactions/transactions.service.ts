import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { ExchangeRatesService } from './exchange-rates.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly clientsService: ClientsService,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const client = await this.clientsService.findOne(
      createTransactionDto.clientId,
    );
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    let amount = createTransactionDto.amount;

    if (createTransactionDto.currency !== 'EUR') {
      amount = await this.exchangeRatesService.convertCurrency(
        createTransactionDto.date,
        createTransactionDto.amount,
        createTransactionDto.currency,
      );
    }

    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      amount,
      currency: 'EUR',
      original_amount: createTransactionDto.amount,
      original_currency: createTransactionDto.currency,
    });
    return this.transactionsRepository.save(transaction);
  }

  getClientDepositsWithinMonthUntilDate(clientId: number, date: string) {
    const baseDate = new Date(date);
    baseDate.setDate(1);
    const startDate = baseDate.toISOString().split('T').shift();

    return this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.client_id = :clientId', { clientId })
      .andWhere('transaction.date >= :startDate', { startDate })
      .andWhere('transaction.date <= :endDate', { endDate: date })
      .getMany();
  }
}

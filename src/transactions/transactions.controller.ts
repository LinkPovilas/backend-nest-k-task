import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CommissionsService } from './commissions.service';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly commissionsService: CommissionsService,
  ) {}

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @HttpCode(200)
  @Post('commission')
  calculateCommission(@Body() calculateCommissionDto: CalculateCommissionDto) {
    return this.commissionsService.calculate(calculateCommissionDto);
  }
}

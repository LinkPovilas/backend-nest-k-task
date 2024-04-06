import { Injectable } from '@nestjs/common';
import { CommissionHandler } from './commission.handler';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { TransactionsService } from '../../transactions.service';
import { CommissionRuleHandler } from '../../interfaces/commission-rule-handler.interfaces';
import { pricingRule } from '../../constants/pricing-rule';
import * as currency from 'currency.js';

@Injectable()
export class HighTurnoverDiscountHandler
  extends CommissionHandler
  implements CommissionRuleHandler
{
  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }

  async handle(
    request: CalculateCommissionDto,
    baselineFee: number = pricingRule.default.price,
  ) {
    const deposits =
      await this.transactionsService.getClientDepositsWithinMonthUntilDate(
        request.clientId,
        request.date,
      );
    const initialValue = 0;
    let depositAmount = initialValue;

    if (deposits.length !== 0) {
      depositAmount = deposits.reduce(
        (accumulator, currentValue) =>
          currency(accumulator).add(currentValue.amount).value,
        initialValue,
      );
    }

    const { discountThresholdAmount, discountRate } = pricingRule.highTurnover;

    const commissionFee =
      depositAmount >= discountThresholdAmount ? discountRate : baselineFee;

    return this.nextHandler
      ? this.nextHandler.handle(request, commissionFee)
      : commissionFee;
  }
}

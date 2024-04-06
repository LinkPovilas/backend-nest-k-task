import { Injectable } from '@nestjs/common';
import { CommissionHandler } from './commission.handler';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { CommissionRuleHandler } from '../../interfaces/commission-rule-handler.interfaces';
import { pricingRule } from '../../constants/pricing-rule';
import * as currency from 'currency.js';

@Injectable()
export class DefaultPriceHandler
  extends CommissionHandler
  implements CommissionRuleHandler
{
  handle(
    request: CalculateCommissionDto,
    baselineFee: number = pricingRule.default.price,
  ) {
    const commissionFee = Math.max(
      currency(request.amount)
        .multiply(pricingRule.default.feePercentage)
        .divide(100).value,
      baselineFee,
    );

    return this.nextHandler
      ? this.nextHandler.handle(request, commissionFee)
      : commissionFee;
  }
}

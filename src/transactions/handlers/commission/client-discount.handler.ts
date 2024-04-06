import { Injectable } from '@nestjs/common';
import { CommissionHandler } from './commission.handler';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { ClientsService } from '../../../clients/clients.service';
import { CommissionRuleHandler } from '../../interfaces/commission-rule-handler.interfaces';
import { pricingRule } from '../../constants/pricing-rule';

@Injectable()
export class ClientDiscountHandler
  extends CommissionHandler
  implements CommissionRuleHandler
{
  constructor(private readonly clientsService: ClientsService) {
    super();
  }

  async handle(
    request: CalculateCommissionDto,
    baselineFee: number = pricingRule.default.price,
  ) {
    const { discount_rate: discountRate } = await this.clientsService.findOne(
      request.clientId,
    );

    const commissionFee = discountRate
      ? Math.min(baselineFee, discountRate)
      : baselineFee;

    return this.nextHandler
      ? this.nextHandler.handle(request, commissionFee)
      : commissionFee;
  }
}

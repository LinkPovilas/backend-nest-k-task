import { CalculateCommissionDto } from '../dto/calculate-commission.dto';

export interface CommissionRuleHandler {
  setNextHandler(handler: CommissionRuleHandler): CommissionRuleHandler;
  handle(
    request: CalculateCommissionDto,
    baselineFee: number,
  ): number | Promise<number>;
}

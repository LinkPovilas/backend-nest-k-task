import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { CommissionRuleHandler } from '../../interfaces/commission-rule-handler.interfaces';

export abstract class CommissionHandler implements CommissionRuleHandler {
  protected nextHandler: CommissionRuleHandler | null = null;

  setNextHandler(handler: CommissionRuleHandler) {
    this.nextHandler = handler;
    return handler;
  }

  abstract handle(
    request: CalculateCommissionDto,
    baselineFee: number,
  ): number | Promise<number>;
}

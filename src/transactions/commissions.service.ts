import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { ClientDiscountHandler } from './handlers/commission/client-discount.handler';
import { DefaultPriceHandler } from './handlers/commission/default-price.handler';
import { HighTurnoverDiscountHandler } from './handlers/commission/high-turnover-discount.handler';
import { ClientsService } from '../clients/clients.service';
import { CommissionDto } from './dto/commission.dto';

@Injectable()
export class CommissionsService {
  constructor(
    private readonly clientService: ClientsService,
    private readonly defaultPriceHandler: DefaultPriceHandler,
    private readonly highTurnoverDiscountHandler: HighTurnoverDiscountHandler,
    private readonly clientDiscountHandler: ClientDiscountHandler,
  ) {}

  async calculate(calculateCommissionDto: CalculateCommissionDto) {
    const client = await this.clientService.findOne(
      calculateCommissionDto.clientId,
    );

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    this.defaultPriceHandler.setNextHandler(this.highTurnoverDiscountHandler);
    this.highTurnoverDiscountHandler.setNextHandler(this.clientDiscountHandler);

    const amount = await this.defaultPriceHandler.handle(
      calculateCommissionDto,
    );

    return new CommissionDto({ amount });
  }
}

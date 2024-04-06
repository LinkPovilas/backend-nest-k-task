import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { ClientDiscountHandler } from './handlers/commission/client-discount.handler';
import { DefaultPriceHandler } from './handlers/commission/default-price.handler';
import { HighTurnoverDiscountHandler } from './handlers/commission/high-turnover-discount.handler';
import { plainToClass } from 'class-transformer';
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
    const request = plainToClass(
      CalculateCommissionDto,
      calculateCommissionDto,
    );

    const client = await this.clientService.findOne(request.clientId);
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    this.defaultPriceHandler.setNextHandler(this.highTurnoverDiscountHandler);
    this.highTurnoverDiscountHandler.setNextHandler(this.clientDiscountHandler);

    const amount = await this.defaultPriceHandler.handle(request);
    return new CommissionDto({ amount });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ClientDiscountHandler } from './client-discount.handler';
import { ClientsService } from '../../../clients/clients.service';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { Client } from '../../../clients/entities/client.entity';
import { pricingRule } from '../../constants/pricing-rule';

describe('ClientDiscountHandler', () => {
  let handler: ClientDiscountHandler;
  let clientsServiceMock: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientDiscountHandler,
        {
          provide: ClientsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<ClientDiscountHandler>(ClientDiscountHandler);
    clientsServiceMock = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    const clientSpecificRate = 0.05;
    const requestMock = () => ({}) as CalculateCommissionDto;
    const mockClientDiscountRate = (discountRate: number) =>
      jest.spyOn(clientsServiceMock, 'findOne').mockResolvedValueOnce({
        discount_rate: discountRate,
      } as Client);

    it('should return default rate if client has no specific rate', async () => {
      mockClientDiscountRate(null);
      const result = await handler.handle(requestMock());

      expect(clientsServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).not.toBeLessThan(pricingRule.default.price);
    });

    it('should return client specific rate', async () => {
      const increasedCommissionFee = 0.06;
      mockClientDiscountRate(clientSpecificRate);

      const result = await handler.handle(
        requestMock(),
        increasedCommissionFee,
      );

      expect(clientsServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBe(clientSpecificRate);
    });

    it('should return lower rate than client specific rate', async () => {
      const lowerCommissionFee = 0.03;
      mockClientDiscountRate(clientSpecificRate);

      const result = await handler.handle(requestMock(), lowerCommissionFee);

      expect(clientsServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBe(lowerCommissionFee);
    });
  });
});

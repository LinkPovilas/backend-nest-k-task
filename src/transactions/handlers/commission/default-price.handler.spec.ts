import { Test, TestingModule } from '@nestjs/testing';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { DefaultPriceHandler } from './default-price.handler';
import { pricingRule } from '../../constants/pricing-rule';

describe('DefaultPriceHandler', () => {
  let handler: DefaultPriceHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultPriceHandler],
    }).compile();

    handler = module.get<DefaultPriceHandler>(DefaultPriceHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    const requestMock = (amount: number) =>
      ({ amount }) as CalculateCommissionDto;

    it('should calculate commission fee', async () => {
      const result = await handler.handle(requestMock(500));
      expect(result).toBe(2.5);
    });

    it('should return the default price if calculated commission fee is lower', async () => {
      const result = await handler.handle(requestMock(9));
      expect(result).not.toBeLessThan(pricingRule.default.price);
    });
  });
});

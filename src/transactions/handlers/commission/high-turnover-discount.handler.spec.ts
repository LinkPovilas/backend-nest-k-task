import { Test, TestingModule } from '@nestjs/testing';
import { CalculateCommissionDto } from '../../dto/calculate-commission.dto';
import { HighTurnoverDiscountHandler } from './high-turnover-discount.handler';
import { TransactionsService } from '../../transactions.service';
import { Transaction } from '../../entities/transaction.entity';
import { pricingRule } from '../../constants/pricing-rule';

describe('HighTurnoverDiscountHandler', () => {
  let handler: HighTurnoverDiscountHandler;
  let transactionsServiceMock: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HighTurnoverDiscountHandler,
        {
          provide: TransactionsService,
          useValue: {
            getClientDepositsWithinMonthUntilDate: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<HighTurnoverDiscountHandler>(
      HighTurnoverDiscountHandler,
    );
    transactionsServiceMock =
      module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    const requestMock = () => ({}) as CalculateCommissionDto;
    const transactionMock = (amount: number) => ({ amount }) as Transaction;
    const mockDeposits = (...deposits: Transaction[]) =>
      jest
        .spyOn(transactionsServiceMock, 'getClientDepositsWithinMonthUntilDate')
        .mockResolvedValueOnce(deposits);

    it('should return discount fee if total deposit meets or exceeds threshold', async () => {
      mockDeposits(transactionMock(500), transactionMock(500));

      const result = await handler.handle(requestMock());

      expect(
        transactionsServiceMock.getClientDepositsWithinMonthUntilDate,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(pricingRule.highTurnover.discountRate);
    });

    it('should return default commission fee if deposit amount is lower than the threshold', async () => {
      mockDeposits(
        transactionMock(500),
        transactionMock(400),
        transactionMock(99),
      );

      const result = await handler.handle(requestMock());

      expect(
        transactionsServiceMock.getClientDepositsWithinMonthUntilDate,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(pricingRule.default.price);
    });

    it('should return default commission fee if there are no deposits', async () => {
      mockDeposits();

      const result = await handler.handle(requestMock());

      expect(
        transactionsServiceMock.getClientDepositsWithinMonthUntilDate,
      ).toHaveBeenCalledTimes(1);
      expect(result).toBe(pricingRule.default.price);
    });
  });
});

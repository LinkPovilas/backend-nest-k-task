import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CommissionsService } from './commissions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { CommissionDto } from './dto/commission.dto';
import { Transaction } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsServiceMock: TransactionsService;
  let commissionsServiceMock: CommissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: { create: jest.fn() },
        },
        {
          provide: CommissionsService,
          useValue: { calculate: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsServiceMock =
      module.get<TransactionsService>(TransactionsService);
    commissionsServiceMock = module.get<CommissionsService>(CommissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should save a transaction', async () => {
      const requestMock = {
        client_id: 1,
        amount: 100,
        currency: 'EUR',
        date: '2020-01-01',
      } as CreateTransactionDto;
      const responseMock = {
        ...requestMock,
        original_amount: requestMock.amount,
        original_currency: requestMock.currency,
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      } as Transaction;

      jest
        .spyOn(transactionsServiceMock, 'create')
        .mockResolvedValueOnce(responseMock);

      const transaction = await controller.createTransaction(requestMock);

      expect(transactionsServiceMock.create).toHaveBeenCalledWith(requestMock);
      expect(transaction).toBe(responseMock);
    });
  });

  describe('calculateCommission', () => {
    it('should return commission fee', async () => {
      const requestMock = {
        client_id: 1,
        amount: 1,
        currency: 'EUR',
        date: '2020-01-01',
      } as CalculateCommissionDto;

      const responseMock = {
        amount: 0.05,
        currency: 'EUR',
      } as CommissionDto;

      jest
        .spyOn(commissionsServiceMock, 'calculate')
        .mockResolvedValueOnce(responseMock);

      const commission = await controller.calculateCommission(requestMock);

      expect(commissionsServiceMock.calculate).toHaveBeenCalledWith(
        requestMock,
      );
      expect(commission).toBe(responseMock);
    });
  });
});

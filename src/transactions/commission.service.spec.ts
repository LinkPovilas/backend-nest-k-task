import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsService } from './commissions.service';
import { ClientsService } from '../clients/clients.service';
import { DefaultPriceHandler } from './handlers/commission/default-price.handler';
import { ClientDiscountHandler } from './handlers/commission/client-discount.handler';
import { HighTurnoverDiscountHandler } from './handlers/commission/high-turnover-discount.handler';
import { plainToClass } from 'class-transformer';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { BadRequestException } from '@nestjs/common';
import { CommissionDto } from './dto/commission.dto';

describe('CommissionsService', () => {
  let service: CommissionsService;
  let clientServiceMock: Partial<ClientsService>;
  let defaultPriceHandlerMock: Partial<DefaultPriceHandler>;
  let highTurnoverDiscountHandlerMock: Partial<HighTurnoverDiscountHandler>;
  let clientDiscountHandlerMock: Partial<ClientDiscountHandler>;

  const request = plainToClass(CalculateCommissionDto, {
    client_id: 1,
    amount: 5,
    currency: 'EUR',
    date: '2021-01-01',
  });

  beforeEach(async () => {
    clientServiceMock = {
      findOne: jest.fn((clientId: number) =>
        Promise.resolve({
          id: 42,
          client_id: clientId,
          discount_rate: 0.05,
          name: 'Test Client',
          created_at: new Date(),
          updated_at: new Date(),
        }),
      ),
    };

    defaultPriceHandlerMock = {
      setNextHandler: jest.fn(),
      handle: jest.fn(),
    };

    highTurnoverDiscountHandlerMock = {
      setNextHandler: jest.fn(),
      handle: jest.fn(),
    };

    clientDiscountHandlerMock = {
      setNextHandler: jest.fn(),
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionsService,
        {
          provide: ClientsService,
          useValue: clientServiceMock,
        },
        {
          provide: DefaultPriceHandler,
          useValue: defaultPriceHandlerMock,
        },
        {
          provide: HighTurnoverDiscountHandler,
          useValue: highTurnoverDiscountHandlerMock,
        },
        {
          provide: ClientDiscountHandler,
          useValue: clientDiscountHandlerMock,
        },
      ],
    }).compile();

    service = module.get<CommissionsService>(CommissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculate', () => {
    it('should throw error if client not found', async () => {
      jest.spyOn(clientServiceMock, 'findOne').mockResolvedValueOnce(null);

      await expect(service.calculate(request)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should calculate commission', async () => {
      jest.spyOn(defaultPriceHandlerMock, 'handle').mockResolvedValueOnce(0.05);

      const result = await service.calculate(request);

      expect(defaultPriceHandlerMock.handle).toHaveBeenCalledWith(request);
      expect(defaultPriceHandlerMock.setNextHandler).toHaveBeenCalledWith(
        highTurnoverDiscountHandlerMock,
      );
      expect(
        highTurnoverDiscountHandlerMock.setNextHandler,
      ).toHaveBeenCalledWith(clientDiscountHandlerMock);
      expect(clientDiscountHandlerMock.setNextHandler).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(CommissionDto);
      expect(result.amount).toBe(0.05);
    });
  });
});

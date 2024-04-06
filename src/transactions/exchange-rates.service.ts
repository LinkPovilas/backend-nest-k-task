import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ExchangeRatesData } from './interfaces/exchange-rates-data.interface';
import { route } from './constants/route';
import * as currency from 'currency.js';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly httpService: HttpService) {}

  async convertCurrency(
    date: string,
    amount: number,
    baseCurrency: string,
    currencies: string[] = ['EUR'],
  ) {
    const rate = await firstValueFrom(
      this.httpService
        .get<ExchangeRatesData>(
          route.exchangeRates(date, baseCurrency, currencies),
        )
        .pipe(
          map(({ data }) => data.quotes[`${baseCurrency}${currencies[0]}`]),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException(error.message);
          }),
        ),
    );

    if (!rate || isNaN(rate)) {
      throw new InternalServerErrorException('Unable to get exchange rate');
    }

    return currency(amount).multiply(rate).value;
  }
}

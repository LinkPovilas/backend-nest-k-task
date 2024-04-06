export const route = {
  exchangeRates: (date: string, sourceCurrency: string, currencies: string[]) =>
    `/historical?date=${date}&access_key=${process.env.EXCHANGE_RATE_API_KEY}&currencies=${currencies.join(',')}&source=${sourceCurrency}`,
} as const;

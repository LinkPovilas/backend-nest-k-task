export interface ExchangeRatesData {
  success: boolean;
  terms: string;
  privacy: string;
  historical: boolean;
  date: string;
  timestamp: number;
  source: string;
  quotes: {
    [key: string]: number;
  };
}

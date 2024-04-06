import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsISO4217CurrencyCode,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  client_id: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsISO4217CurrencyCode()
  currency: string;

  @ApiProperty({
    example: '2021-01-01',
    format: 'date',
  })
  @MinLength(10)
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString().split('T').shift())
  date: string;

  get clientId() {
    return this.client_id;
  }
}

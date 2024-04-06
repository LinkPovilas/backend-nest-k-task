import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  client_id: number;

  @IsNumber()
  @IsOptional()
  discount_rate: number;
}

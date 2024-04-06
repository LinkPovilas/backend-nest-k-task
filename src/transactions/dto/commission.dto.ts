import { Transform, Type } from 'class-transformer';

export class CommissionDto {
  @Type(() => String)
  @Transform(({ value }) => String(value))
  amount: number;

  currency?: string = 'EUR';

  constructor(data: CommissionDto) {
    Object.assign(this, data);
  }
}

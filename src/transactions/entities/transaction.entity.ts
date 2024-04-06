import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  client_id: number;

  @Column('decimal')
  amount: number;

  @Column({ default: 'EUR' })
  currency: string;

  @Column('decimal')
  original_amount: number;

  @Column()
  original_currency: string;

  @ApiProperty({
    example: '2021-01-01',
    format: 'date',
  })
  @Column()
  date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

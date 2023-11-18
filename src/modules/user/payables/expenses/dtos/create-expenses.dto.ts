import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpensesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  voucher: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  expenseAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ledgerExpenseId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ledgerPaidId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refDoc: string;
}

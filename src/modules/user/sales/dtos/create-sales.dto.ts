import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSalesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cashSaleNo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cashSaleDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionID: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payementStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  saleAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paidAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  conversionRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  reverseRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paidcurrencyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salecurrencyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salesledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bankledgerId: number;
}

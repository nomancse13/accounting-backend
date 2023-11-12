import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoiceNo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transactionID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  creditAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  debitAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchaseAverageRate: number;

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
  debitCurrencyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditCurrencyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitRateBase: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditRateBase: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalDueAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitLedgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditLedgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitCurrencyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditCurrencyId: number;
}

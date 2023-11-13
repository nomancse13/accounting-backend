import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cashPurchaseNo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  purhaseSaleDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionID: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  payementStatus: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  purchaseAmount: number;

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
  purchasecurrencyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplierledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  purchaseledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bankledgerId: number;
}

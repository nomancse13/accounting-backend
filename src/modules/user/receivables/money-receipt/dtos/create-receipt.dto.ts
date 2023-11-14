import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiptDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucher: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  dueAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  transactionNo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refDoc: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  narration: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  accountId: number;
}

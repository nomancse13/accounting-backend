import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentVoucherDto {
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
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplierId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accountId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  recNo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refDoc: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carrier: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  narration: string;
}

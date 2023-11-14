import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSaleVoucherDto {
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
  returnAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  recNo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carrier: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePurchaseReturnDto {
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
  supplierId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  recNo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carrier: string;
}

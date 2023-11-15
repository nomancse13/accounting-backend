import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemInfo {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly itemId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly sellingPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly discount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class CreateInvoiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoiceNo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  month: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subtotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoiceDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileSrc: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vat: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiPropertyOptional({ type: [ItemInfo] })
  @ValidateNested()
  @IsOptional()
  @Type(() => ItemInfo)
  items: ItemInfo[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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
  readonly buyingPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class CreateSupplierInvoiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoiceNo: string;

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
  @IsBoolean()
  vat: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplierId: number;

  @ApiPropertyOptional({ type: [ItemInfo] })
  @ValidateNested()
  @IsOptional()
  @Type(() => ItemInfo)
  items: ItemInfo[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVendorsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendorCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendorName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPersons: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  currencyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplierledgerId1: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplierledgerId2: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustormersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerName: string;

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
  supplierledgerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerledgerId1: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerledgerId2: number;
}

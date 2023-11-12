import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSuppliersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bothCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bothName: string;

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
}

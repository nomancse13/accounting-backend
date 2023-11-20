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

export class CreateManualJounalsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucher: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  narration: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileSrc: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  recNo: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  debitId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creditId: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  buyingPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sellingPrice: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  designationName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  note: string;
}

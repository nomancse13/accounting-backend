import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmployeesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  presentAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  permanentAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dob: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  joiningDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nationalId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalSalary: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pin: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nhifNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nssfNumber: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profileImgSrc: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  designationId: number;
}

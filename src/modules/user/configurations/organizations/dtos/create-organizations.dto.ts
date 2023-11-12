import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organisationName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organisationType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationLogo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseExpired: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountingGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  groupParent: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupIdentifier: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nature: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postedTo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupHeadType: string;
}

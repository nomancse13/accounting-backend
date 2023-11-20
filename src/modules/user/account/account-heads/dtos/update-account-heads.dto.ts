import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccountHeadsDto } from './create-account-heads.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountHeadsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

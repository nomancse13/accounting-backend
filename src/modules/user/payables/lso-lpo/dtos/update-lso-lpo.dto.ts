import { PartialType } from '@nestjs/swagger';
import { CreateLsoLpoDto } from './create-lso-lpo.dto';

export class UpdateLsoLpoDto extends PartialType(CreateLsoLpoDto) {}

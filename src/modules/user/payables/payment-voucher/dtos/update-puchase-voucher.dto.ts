import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseVoucherDto } from './create-puchase-voucher.dto';

export class UpdatePurchaseVoucherDto extends PartialType(
  CreatePurchaseVoucherDto,
) {}

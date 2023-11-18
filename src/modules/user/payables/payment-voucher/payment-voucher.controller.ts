import { UserGuard } from 'src/authentication/auth/guards';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';
import { PaymentVoucherService } from './payment-voucher.service';
import { CreatePaymentVoucherDto, UpdatePaymentVoucherDto } from './dtos';

@ApiTags('User|Payment Voucher')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'payment/voucher',
  version: '1',
})
export class PaymentVoucherController {
  constructor(private paymentVoucherService: PaymentVoucherService) {}

  //   create a new payment voucher
  @ApiOperation({
    summary: 'create payment voucher by a user',
    description: 'this route is responsible for create a payment voucher',
  })
  @ApiBody({
    type: CreatePaymentVoucherDto,
    description:
      'How to create a payment voucher with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter sale voucher',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          amount: 6,
          supplierId: 2,
          accountId: 2,
          recNo: 6,
          refDoc: 6,
          carrier: 'sdfjdofjdsfl',
          narration: 'sdfjdofjdsfl',
        } as unknown as CreatePaymentVoucherDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createpaymentVoucherDto: CreatePaymentVoucherDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.paymentVoucherService.createPaymentVoucher(
      createpaymentVoucherDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a payment voucher by id
  @ApiOperation({
    summary: 'update payment voucher by id',
    description: 'this route is responsible for update payment voucher by id',
  })
  @ApiBody({
    type: UpdatePaymentVoucherDto,
    description:
      'How to update a payment voucher by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          returnAmount: 6,
          customerId: 6,
          recNo: 6,
          carrier: 'sdfjdofjdsfl',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a payment voucher required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updatePaymentVoucherDto: UpdatePaymentVoucherDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.paymentVoucherService.updatepaymentVoucher(
      updatePaymentVoucherDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single payment voucher
  @ApiOperation({
    summary: 'find single payment voucher by id',
    description:
      'this route is responsible for find single payment voucher by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single payment voucher required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data = await this.paymentVoucherService.findOnepaymentVoucherData(id);
    return { message: 'successful!', result: data };
  }

  // get all payment voucher data with paginaiton
  @ApiOperation({
    summary: 'get all payment voucher data with pagination',
    description:
      'this route is responsible for getting all payment voucher data with pagination',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'insert limit if you need',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'insert page if you need',
    required: false,
  })
  @ApiQuery({
    name: 'filter',
    type: String,
    description: 'insert filter if you need',
    required: false,
  })
  @Get('get/all')
  async getAll(
    @Query() listQueryParam: PaginationOptionsInterface,
    @Query('filter') filter: any,
    @UserPayload() userPayload: UserInterface,
  ) {
    const result = await this.paymentVoucherService.findAllpaymentVoucherData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single payment voucher account
  @ApiOperation({
    summary: 'delete single payment voucher account by id',
    description:
      'this route is responsible for delete single payment voucher account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single payment voucher account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.paymentVoucherService.deletepaymentVoucher(id);
    return { message: 'successful!', result: data };
  }
}

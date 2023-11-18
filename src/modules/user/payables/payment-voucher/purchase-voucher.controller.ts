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
import { PurchaseVoucherService } from './purchase-voucher.service';
import { CreatePurchaseVoucherDto, UpdatePurchaseVoucherDto } from './dtos';

@ApiTags('User|Purchase Voucher')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'purchase/voucher',
  version: '1',
})
export class PurchaseVoucherController {
  constructor(private purchaseVoucherService: PurchaseVoucherService) {}

  //   create a new purchase voucher
  @ApiOperation({
    summary: 'create purchase voucher by a user',
    description: 'this route is responsible for create a purchase voucher',
  })
  @ApiBody({
    type: CreatePurchaseVoucherDto,
    description:
      'How to create a purchase voucher with body?... here is the example given below!',
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
        } as unknown as CreatePurchaseVoucherDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createPurchaseVoucherDto: CreatePurchaseVoucherDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.purchaseVoucherService.createPurchaseVoucher(
      createPurchaseVoucherDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a purchase voucher by id
  @ApiOperation({
    summary: 'update purchase voucher by id',
    description: 'this route is responsible for update purchase voucher by id',
  })
  @ApiBody({
    type: UpdatePurchaseVoucherDto,
    description:
      'How to update a purchase voucher by id?... here is the example given below!',
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
    description: 'for update a purchase voucher required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updatePurchaseVoucherDto: UpdatePurchaseVoucherDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.purchaseVoucherService.updatePurchaseVoucher(
      updatePurchaseVoucherDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single purchase voucher
  @ApiOperation({
    summary: 'find single purchase voucher by id',
    description:
      'this route is responsible for find single purchase voucher by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single purchase voucher required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data =
      await this.purchaseVoucherService.findOnePurchaseVoucherData(id);
    return { message: 'successful!', result: data };
  }

  // get all purchase voucher data with paginaiton
  @ApiOperation({
    summary: 'get all purchase voucher data with pagination',
    description:
      'this route is responsible for getting all purchase voucher data with pagination',
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
    const result = await this.purchaseVoucherService.findAllPurchaseVoucherData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single purchase voucher account
  @ApiOperation({
    summary: 'delete single purchase voucher account by id',
    description:
      'this route is responsible for delete single purchase voucher account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single purchase voucher account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.purchaseVoucherService.deletePurchaseVoucher(id);
    return { message: 'successful!', result: data };
  }
}

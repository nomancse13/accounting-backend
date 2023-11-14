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
import { SaleVoucherService } from './sale-voucher.service';
import { CreateSaleVoucherDto, UpdateSaleVoucherDto } from './dtos';

@ApiTags('User|Sale Voucher')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'sale/voucher',
  version: '1',
})
export class SaleVoucherController {
  constructor(private saleVoucherService: SaleVoucherService) {}

  //   create a new sale voucher
  @ApiOperation({
    summary: 'create sale voucher by a user',
    description: 'this route is responsible for create a sale voucher',
  })
  @ApiBody({
    type: CreateSaleVoucherDto,
    description:
      'How to create a sale voucher with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter sale voucher',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          returnAmount: 6,
          customerId: 6,
          recNo: 6,
          carrier: 'sdfjdofjdsfl',
        } as unknown as CreateSaleVoucherDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createSaleVoucherDto: CreateSaleVoucherDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.saleVoucherService.createSaleVoucher(
      createSaleVoucherDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a sale voucher by id
  @ApiOperation({
    summary: 'update sale voucher by id',
    description: 'this route is responsible for update sale voucher by id',
  })
  @ApiBody({
    type: UpdateSaleVoucherDto,
    description:
      'How to update a sale voucher by id?... here is the example given below!',
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
    description: 'for update a sale voucher required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateSaleVoucherDto: UpdateSaleVoucherDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.saleVoucherService.updateSaleVoucher(
      updateSaleVoucherDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single sale voucher
  @ApiOperation({
    summary: 'find single sale voucher by id',
    description: 'this route is responsible for find single sale voucher by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single sale voucher required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data = await this.saleVoucherService.findOneVoucherData(id);
    return { message: 'successful!', result: data };
  }

  // get all sale voucher data with paginaiton
  @ApiOperation({
    summary: 'get all sale voucher data with pagination',
    description:
      'this route is responsible for getting all sale voucher data with pagination',
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
    const result = await this.saleVoucherService.findAllVoucherData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single sale voucher account
  @ApiOperation({
    summary: 'delete single sale voucher account by id',
    description:
      'this route is responsible for delete single sale voucher account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single sale voucher account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.saleVoucherService.deleteSale(id);
    return { message: 'successful!', result: data };
  }
}

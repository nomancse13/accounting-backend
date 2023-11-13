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
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dtos';

@ApiTags('User|Purchase')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'purchase',
  version: '1',
})
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  //   create a new purchase
  @ApiOperation({
    summary: 'create purchase by a user',
    description: 'this route is responsible for create a purchase',
  })
  @ApiBody({
    type: CreatePurchaseDto,
    description:
      'How to create a purchase with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter purchase',
        value: {
          cashPurchaseNo: 'jsdhfdo',
          transactionID: 'noman',
          reference: '0192938283',
          comment: 'jamn',
          payementStatus: 'syedpur',
          purchaseAmount: 1,
          paidAmount: 6,
          conversionRate: 6,
          reverseRate: 6,
          paidcurrencyId: 6,
          purchasecurrencyId: 6,
          bankledgerId: 6,
          purchaseledgerId: 6,
          supplierledgerId: 6,
        } as unknown as CreatePurchaseDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.purchaseService.createPurchase(
      createPurchaseDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a purchase by id
  @ApiOperation({
    summary: 'update purchase by id',
    description: 'this route is responsible for update purchase by id',
  })
  @ApiBody({
    type: UpdatePurchaseDto,
    description:
      'How to update a purchase by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          cashPurchaseNo: 'jsdhfdo',
          transactionID: 'noman',
          reference: '0192938283',
          comment: 'jamn',
          payementStatus: 'syedpur',
          purchaseAmount: 1,
          paidAmount: 6,
          conversionRate: 6,
          reverseRate: 6,
          paidcurrencyId: 6,
          purchasecurrencyId: 6,
          bankledgerId: 6,
          purchaseledgerId: 6,
          supplierledgerId: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a purchase required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updatePurchaseDto: UpdatePurchaseDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.purchaseService.updatePurchase(
      updatePurchaseDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single purchase account
  @ApiOperation({
    summary: 'find single purchase by id',
    description: 'this route is responsible for find single purchase by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single purchase required id',
    required: true,
  })
  @Get(':id')
  async findSinglePurchase(@Param('id') id: number) {
    const data = await this.purchaseService.findOnePurchase(id);
    return { message: 'successful!', result: data };
  }

  // get all purchase data with paginaiton
  @ApiOperation({
    summary: 'get all purchase data with pagination',
    description:
      'this route is responsible for getting all purchase data with pagination',
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
    const result = await this.purchaseService.findAllPurchaseData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single purchase
  @ApiOperation({
    summary: 'delete single purchase by id',
    description: 'this route is responsible for delete single purchase by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single purchase required id',
    required: true,
  })
  @Delete(':id')
  async deleteCustomers(@Param('id') id: number) {
    const data = await this.purchaseService.deletePurchase(id);
    return { message: 'successful!', result: data };
  }
}

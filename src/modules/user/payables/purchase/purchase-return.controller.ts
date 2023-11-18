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
import { PurchaseReturnService } from './purchase-return.service';
import { CreatePurchaseReturnDto, UpdatePurchaseReturnDto } from './dtos';

@ApiTags('User|Purchase Return')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'purchase/return',
  version: '1',
})
export class PurchaseReturnController {
  constructor(private purchaseReturnService: PurchaseReturnService) {}

  //   create a new purchase return
  @ApiOperation({
    summary: 'create purchase return by a user',
    description: 'this route is responsible for create a purchase return',
  })
  @ApiBody({
    type: CreatePurchaseReturnDto,
    description:
      'How to create a purchase return with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter purchase return',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          returnAmount: 6,
          supplierId: 2,
          recNo: 6,
          carrier: 'sdfjdofjdsfl',
        } as unknown as CreatePurchaseReturnDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createPurchaseReturnDto: CreatePurchaseReturnDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.purchaseReturnService.createPurchaseReturn(
      createPurchaseReturnDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a purchase return by id
  @ApiOperation({
    summary: 'update purchase return by id',
    description: 'this route is responsible for update purchase return by id',
  })
  @ApiBody({
    type: UpdatePurchaseReturnDto,
    description:
      'How to update a purchase return by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          returnAmount: 6,
          supplierId: 2,
          recNo: 6,
          carrier: 'sdfjdofjdsfl',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a purchase return required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updatePurchaseReturnDto: UpdatePurchaseReturnDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.purchaseReturnService.updatePurchaseReturn(
      updatePurchaseReturnDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single purchase return
  @ApiOperation({
    summary: 'find single purchase return by id',
    description:
      'this route is responsible for find single purchase return by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single purchase return required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data = await this.purchaseReturnService.findPurchaseReturnData(id);
    return { message: 'successful!', result: data };
  }

  // get all purchase return data with paginaiton
  @ApiOperation({
    summary: 'get all purchase return data with pagination',
    description:
      'this route is responsible for getting all purchase return data with pagination',
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
    const result = await this.purchaseReturnService.findAllPurchaseReturnData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single purchase return
  @ApiOperation({
    summary: 'delete single purchase return by id',
    description:
      'this route is responsible for delete single purchase return by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single purchase return required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.purchaseReturnService.deletePurchaseReturn(id);
    return { message: 'successful!', result: data };
  }
}

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
import { SalesService } from './sales.service';
import { CreateSalesDto, UpdateSalesDto } from './dtos';

@ApiTags('User|Sales')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'sales',
  version: '1',
})
export class SalesController {
  constructor(private salesService: SalesService) {}

  //   create a new sales
  @ApiOperation({
    summary: 'create sales by a user',
    description: 'this route is responsible for create a sales',
  })
  @ApiBody({
    type: CreateSalesDto,
    description:
      'How to create a sales with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter sales',
        value: {
          cashSaleNo: 'jsdhfdo',
          transactionID: 'noman',
          reference: '0192938283',
          comment: 'jamn',
          payementStatus: 'syedpur',
          saleAmount: 1,
          paidAmount: 6,
          conversionRate: 6,
          reverseRate: 6,
          paidcurrencyId: 1,
          salecurrencyId: 1,
          bankledgerId: 6,
          debitledgerId: 6,
          salesledgerId: 6,
        } as unknown as CreateSalesDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createSalesDto: CreateSalesDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.salesService.createSales(
      createSalesDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a sales by id
  @ApiOperation({
    summary: 'update sales by id',
    description: 'this route is responsible for update sales by id',
  })
  @ApiBody({
    type: UpdateSalesDto,
    description:
      'How to update a sales by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          cashSaleNo: 'jsdhfdo',
          transactionID: 'noman',
          reference: '0192938283',
          comment: 'jamn',
          payementStatus: 'syedpur',
          saleAmount: 1,
          paidAmount: 6,
          conversionRate: 6,
          reverseRate: 6,
          paidcurrencyId: 1,
          salecurrencyId: 1,
          bankledgerId: 6,
          debitledgerId: 6,
          salesledgerId: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a sales required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateSalesDto: UpdateSalesDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.salesService.updateSales(
      updateSalesDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single sales account
  @ApiOperation({
    summary: 'find single sales by id',
    description: 'this route is responsible for find single sales by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single sales required id',
    required: true,
  })
  @Get(':id')
  async findSingleSales(@Param('id') id: number) {
    const data = await this.salesService.findOneSalesData(id);
    return { message: 'successful!', result: data };
  }

  // get all sales data with paginaiton
  @ApiOperation({
    summary: 'get all sales data with pagination',
    description:
      'this route is responsible for getting all sales data with pagination',
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
    const result = await this.salesService.findAllSalesData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single sales
  @ApiOperation({
    summary: 'delete single sales by id',
    description: 'this route is responsible for delete single sales by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single sales required id',
    required: true,
  })
  @Delete(':id')
  async deleteSales(@Param('id') id: number) {
    const data = await this.salesService.deleteSales(id);
    return { message: 'successful!', result: data };
  }
}

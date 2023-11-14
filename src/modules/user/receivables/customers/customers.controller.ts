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
import { CustomersService } from './customers.service';
import { CreateCustormersDto, UpdateCustomersDto } from './dtos';

@ApiTags('User|Customers')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  //   create a new customers account
  @ApiOperation({
    summary: 'create customers by a user',
    description: 'this route is responsible for create a customers',
  })
  @ApiBody({
    type: CreateCustormersDto,
    description:
      'How to create a customers with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter customers',
        value: {
          customerCode: 'jsdhfdo',
          customerName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
          supplierledgerId: 6,
          customerledgerId1: 6,
          customerledgerId2: 6,
        } as unknown as CreateCustormersDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createCustormersDto: CreateCustormersDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.customersService.createCustomers(
      createCustormersDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a customers by id
  @ApiOperation({
    summary: 'update customers by id',
    description: 'this route is responsible for update customers by id',
  })
  @ApiBody({
    type: UpdateCustomersDto,
    description:
      'How to update a customers by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          customerCode: 'jsdhfdo',
          customerName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
          supplierledgerId: 6,
          customerledgerId1: 6,
          customerledgerId2: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a customers required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateCustomersDto: UpdateCustomersDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.customersService.updateCustomers(
      updateCustomersDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single customers account
  @ApiOperation({
    summary: 'find single customers by id',
    description: 'this route is responsible for find single customers by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single customers required id',
    required: true,
  })
  @Get(':id')
  async findSingleCustomers(@Param('id') id: number) {
    const data = await this.customersService.findOneCustomer(id);
    return { message: 'successful!', result: data };
  }

  // get all customers data with paginaiton
  @ApiOperation({
    summary: 'get all customers data with pagination',
    description:
      'this route is responsible for getting all customers data with pagination',
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
    const result = await this.customersService.findAllCustomersData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single customers account
  @ApiOperation({
    summary: 'delete single customers account by id',
    description:
      'this route is responsible for delete single customers account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single customers account required id',
    required: true,
  })
  @Delete(':id')
  async deleteCustomers(@Param('id') id: number) {
    const data = await this.customersService.deleteCustomer(id);
    return { message: 'successful!', result: data };
  }
}

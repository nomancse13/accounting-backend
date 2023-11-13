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
import { SuppliersService } from './suppliers.service';
import { CreateSuppliersDto, UpdateSuppliersDto } from './dtos';

@ApiTags('User|Suppliers')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'suppliers',
  version: '1',
})
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  //   create a new suppliers account
  @ApiOperation({
    summary: 'create suppliers by a user',
    description: 'this route is responsible for create a suppliers',
  })
  @ApiBody({
    type: CreateSuppliersDto,
    description:
      'How to create a suppliers with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter suppliers',
        value: {
          bothCode: 'jsdhfdo',
          bothName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
        } as unknown as CreateSuppliersDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createSuppliersDto: CreateSuppliersDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.suppliersService.createSuppliers(
      createSuppliersDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a suppliers by id
  @ApiOperation({
    summary: 'update suppliers by id',
    description: 'this route is responsible for update suppliers by id',
  })
  @ApiBody({
    type: UpdateSuppliersDto,
    description:
      'How to update a suppliers by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          bothCode: 'jsdhfdo',
          bothName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a suppliers required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateSuppliersDto: UpdateSuppliersDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.suppliersService.updateSuppliers(
      updateSuppliersDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single suppliers account
  @ApiOperation({
    summary: 'find single suppliers by id',
    description: 'this route is responsible for find single suppliers by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single suppliers required id',
    required: true,
  })
  @Get(':id')
  async findSingleSuppliers(@Param('id') id: number) {
    const data = await this.suppliersService.findOneSupplier(id);
    return { message: 'successful!', result: data };
  }

  // get all suppliers data with paginaiton
  @ApiOperation({
    summary: 'get all suppliers data with pagination',
    description:
      'this route is responsible for getting all suppliers data with pagination',
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
    const result = await this.suppliersService.findAllSuppliersData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single suppliers account
  @ApiOperation({
    summary: 'delete single suppliers account by id',
    description:
      'this route is responsible for delete single suppliers account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single suppliers account required id',
    required: true,
  })
  @Delete(':id')
  async deleteSuppliers(@Param('id') id: number) {
    const data = await this.suppliersService.deleteSupplier(id);
    return { message: 'successful!', result: data };
  }
}

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
import { VendorsService } from './vendors.service';
import { CreateVendorsDto, UpdateVendorsDto } from './dtos';

@ApiTags('User|Vendors')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'vendors',
  version: '1',
})
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  //   create a new vendors
  @ApiOperation({
    summary: 'create vendors by a user',
    description: 'this route is responsible for create a vendors',
  })
  @ApiBody({
    type: CreateVendorsDto,
    description:
      'How to create a vendors with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter vendors',
        value: {
          vendorCode: 'jsdhfdo',
          vendorName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
          supplierledgerId1: 6,
          supplierledgerId2: 6,
          customerledgerId: 6,
        } as unknown as CreateVendorsDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createVendorsDto: CreateVendorsDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.vendorsService.createVendors(
      createVendorsDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a vendors by id
  @ApiOperation({
    summary: 'update vendors by id',
    description: 'this route is responsible for update vendors by id',
  })
  @ApiBody({
    type: UpdateVendorsDto,
    description:
      'How to update a vendors by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          vendorCode: 'jsdhfdo',
          vendorName: 'noman',
          mobile: '0192938283',
          contactPersons: 'jamn',
          address: 'syedpur',
          currencyId: 1,
          ledgerId: 6,
          supplierledgerId1: 6,
          supplierledgerId2: 6,
          customerledgerId: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a vendors required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateVendorsDto: UpdateVendorsDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.vendorsService.updateVendors(
      updateVendorsDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single vendors account
  @ApiOperation({
    summary: 'find single vendors by id',
    description: 'this route is responsible for find single vendors by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single vendors required id',
    required: true,
  })
  @Get(':id')
  async findSingleVendors(@Param('id') id: number) {
    const data = await this.vendorsService.findOneVendors(id);
    return { message: 'successful!', result: data };
  }

  // get all vendors data with paginaiton
  @ApiOperation({
    summary: 'get all vendors data with pagination',
    description:
      'this route is responsible for getting all vendors data with pagination',
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
    const result = await this.vendorsService.findAllVendorsData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single vendors account
  @ApiOperation({
    summary: 'delete single vendors account by id',
    description:
      'this route is responsible for delete single vendors account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single vendors account required id',
    required: true,
  })
  @Delete(':id')
  async deleteVendors(@Param('id') id: number) {
    const data = await this.vendorsService.deleteVendors(id);
    return { message: 'successful!', result: data };
  }
}

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
import { ItemService } from './item.service';
import { CreateServiceDto, UpdateServiceDto } from './dtos';

@ApiTags('User|Service')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'service',
  version: '1',
})
export class ServiceController {
  constructor(private itemService: ItemService) {}

  //   create a new service
  @ApiOperation({
    summary: 'create service by a user',
    description: 'this route is responsible for create a service',
  })
  @ApiBody({
    type: CreateServiceDto,
    description:
      'How to create a service with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter service info',
        value: {
          serviceName: 'demo',
          buyingPrice: 1,
          sellingPrice: 6,
        } as unknown as CreateServiceDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.itemService.createItem(
      createServiceDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an service by id
  @ApiOperation({
    summary: 'update service by id',
    description: 'this route is responsible for update service by id',
  })
  @ApiBody({
    type: UpdateServiceDto,
    description:
      'How to update an service by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          serviceName: 'demo',
          buyingPrice: 1,
          sellingPrice: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a service required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateServiceDto: UpdateServiceDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.itemService.updateItem(
      updateServiceDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single service
  @ApiOperation({
    summary: 'find single service by id',
    description: 'this route is responsible for find single service by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single service required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.itemService.findOneItem(id);
    return { message: 'successful!', result: data };
  }

  // get all service data with paginaiton
  @ApiOperation({
    summary: 'get all service data with pagination',
    description:
      'this route is responsible for getting all service data with pagination',
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
    const result = await this.itemService.findAllItem(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single service
  @ApiOperation({
    summary: 'delete single service by id',
    description: 'this route is responsible for delete single service by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single service required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.itemService.deleteItem(id);
    return { message: 'successful!', result: data };
  }
}

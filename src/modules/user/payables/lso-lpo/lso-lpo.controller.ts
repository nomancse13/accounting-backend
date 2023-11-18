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
import { LsoLpoService } from './lso-lpo.service';
import { CreateLsoLpoDto, UpdateLsoLpoDto } from './dtos';

@ApiTags('User|Lso Lpo')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'lso/lpo',
  version: '1',
})
export class LsoLpoController {
  constructor(private lsoLpoService: LsoLpoService) {}

  //   create a new lso lpo
  @ApiOperation({
    summary: 'create lso lpo by a user',
    description: 'this route is responsible for create a lso lpo',
  })
  @ApiBody({
    type: CreateLsoLpoDto,
    description:
      'How to create a lso lpo with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter lso lpo',
        value: {
          invoiceNo: 'jsdhfdo',
          month: 'November',
          comment: 'this is my first comment',
          subtotal: 123,
          total: 19.68,
          invoiceDate: '23-11-23',
          fileSrc: 'ssrc',
          vat: true,
          customerId: 2,
          items: [
            {
              itemId: 1,
              quantity: 3,
              sellingPrice: 23,
              discount: 34,
              amount: 23,
            },
            {
              itemId: 2,
              quantity: 3,
              sellingPrice: 23,
              discount: 34,
              amount: 23,
            },
          ],
        } as unknown as CreateLsoLpoDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createLsoLpoDto: CreateLsoLpoDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.lsoLpoService.createLsoLpo(
      createLsoLpoDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a lso lpo by id
  @ApiOperation({
    summary: 'update lso lpo by id',
    description: 'this route is responsible for update lso lpo by id',
  })
  @ApiBody({
    type: UpdateLsoLpoDto,
    description:
      'How to update a lso lpo by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          invoiceNo: 'jsdhfdo',
          month: 'November',
          comment: 'this is my first comment',
          subtotal: 123,
          total: 19.68,
          invoiceDate: '23-11-23',
          fileSrc: 'ssrc',
          vat: true,
          customerId: 2,
          items: [
            {
              itemId: 1,
              quantity: 3,
              sellingPrice: 23,
              discount: 34,
              amount: 23,
            },
            {
              itemId: 2,
              quantity: 3,
              sellingPrice: 23,
              discount: 34,
              amount: 23,
            },
          ],
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a lso lpo required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateLsoLpoDto: UpdateLsoLpoDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.lsoLpoService.updateLsoLpo(
      updateLsoLpoDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single lso lpo
  @ApiOperation({
    summary: 'find single lso lpo by id',
    description: 'this route is responsible for find single lso lpo by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single lso lpo required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.lsoLpoService.findOneLsoLpo(id);
    return { message: 'successful!', result: data };
  }

  // get all lso lpo data with paginaiton
  @ApiOperation({
    summary: 'get all lso lpo data with pagination',
    description:
      'this route is responsible for getting all lso lpo data with pagination',
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
    const result = await this.lsoLpoService.findAllLsoLpoData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single lso lpo account
  @ApiOperation({
    summary: 'delete single lso lpo account by id',
    description:
      'this route is responsible for delete single lso lpo account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single lso lpo account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.lsoLpoService.deleteLsoLpo(id);
    return { message: 'successful!', result: data };
  }
}

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
import { AccountHeadsService } from './account-heads.service';
import { CreateAccountHeadsDto, UpdateAccountHeadsDto } from './dtos';

@ApiTags('User|Account Heads')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'account/heads',
  version: '1',
})
export class AccountHeadsController {
  constructor(private accountHeadsService: AccountHeadsService) {}

  //   create a new account heads
  @ApiOperation({
    summary: 'create account heads by a user',
    description: 'this route is responsible for create a account heads',
  })
  @ApiBody({
    type: CreateAccountHeadsDto,
    description:
      'How to create a account heads with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter account heads info',
        value: {
          name: 'test11',
          parentId: 3,
        } as unknown as CreateAccountHeadsDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createAccountHeadsDto: CreateAccountHeadsDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.accountHeadsService.createAccountHeads(
      createAccountHeadsDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an account heads by id
  @ApiOperation({
    summary: 'update account heads by id',
    description: 'this route is responsible for update account heads by id',
  })
  @ApiBody({
    type: UpdateAccountHeadsDto,
    description:
      'How to update an account heads by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          note: 'this is for designation note',
          designationName: 'noman',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a account heads required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateAccountHeadsDto: UpdateAccountHeadsDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.accountHeadsService.updateAccountHeads(
      updateAccountHeadsDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single account heads
  @ApiOperation({
    summary: 'find single account heads by id',
    description:
      'this route is responsible for find single account heads by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single account heads required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.accountHeadsService.findOneHeads(id);
    return { message: 'successful!', result: data };
  }

  // get all account heads data with paginaiton
  @ApiOperation({
    summary: 'get all account heads data with pagination',
    description:
      'this route is responsible for getting all account heads data with pagination',
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
    const result = await this.accountHeadsService.findAllAccountHeads(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // // delete single designation
  // @ApiOperation({
  //   summary: 'delete single designation by id',
  //   description:
  //     'this route is responsible for delete single designation by id',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'delete single designation required id',
  //   required: true,
  // })
  // @Delete(':id')
  // async delete(@Param('id') id: number) {
  //   const data = await this.designationService.deletedesignation(id);
  //   return { message: 'successful!', result: data };
  // }
}

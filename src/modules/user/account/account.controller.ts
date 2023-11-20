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
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dtos';

@ApiTags('User|Account')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(private accountService: AccountService) {}

  //   create a new account
  @ApiOperation({
    summary: 'create account by a user',
    description: 'this route is responsible for create a account',
  })
  @ApiBody({
    type: CreateAccountDto,
    description:
      'How to create a account with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter account info',
        value: {
          groupName: 'test11',
          groupParentId: 1,
          groupIdentifier: 'test',
          groupType: 'test',
          nature: 'test',
          postedTo: 'test',
          groupHeadType: 'test',
        } as unknown as CreateAccountDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.accountService.createAccount(
      createAccountDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an account by id
  @ApiOperation({
    summary: 'update account by id',
    description: 'this route is responsible for update account by id',
  })
  @ApiBody({
    type: UpdateAccountDto,
    description:
      'How to update an account by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          groupName: 'test11',
          groupParentId: 1,
          groupIdentifier: 'test',
          groupType: 'test',
          nature: 'test',
          postedTo: 'test',
          groupHeadType: 'test',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a account required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateAccountDto: UpdateAccountDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.accountService.updateAccount(
      updateAccountDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single account
  @ApiOperation({
    summary: 'find single account by id',
    description: 'this route is responsible for find single account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single account required id',
    required: true,
  })
  @Get(':id')
  async find(@Param('id') id: number) {
    const data = await this.accountService.findOneAccount(id);
    return { message: 'successful!', result: data };
  }

  // get all account data with paginaiton
  @ApiOperation({
    summary: 'get all account data with pagination',
    description:
      'this route is responsible for getting all account data with pagination',
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
    const result = await this.accountService.findAllAccount(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single account
  @ApiOperation({
    summary: 'delete single account by id',
    description: 'this route is responsible for delete single account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.accountService.deleteAccount(id);
    return { message: 'successful!', result: data };
  }
}

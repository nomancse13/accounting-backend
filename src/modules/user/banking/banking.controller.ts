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
import { CreateBankingDto, UpdateBankingDto } from './dtos';
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';
import { BankingService } from './banking.service';

@ApiTags('User|Banking')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'bank/account',
  version: '1',
})
export class BankingController {
  constructor(private bankingService: BankingService) {}

  //   create a new banking account
  @ApiOperation({
    summary: 'create banking account by a user',
    description: 'this route is responsible for create a banking account',
  })
  @ApiBody({
    type: CreateBankingDto,
    description:
      'How to create a banking account with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter banking account',
        value: {
          bankName: 'test11',
          currencyId: 1,
          ledgerId: 6,
          accountCode: 'test11',
          bankAccountName: 'test11',
          accountNumber: 'test11',
          openingBalance: 1000.2,
          accountType: 1000,
          description: 'test11',
        } as unknown as CreateBankingDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createBankingDto: CreateBankingDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.bankingService.createBankAcc(
      createBankingDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a banking by id
  @ApiOperation({
    summary: 'update banking by id',
    description: 'this route is responsible for update banking by id',
  })
  @ApiBody({
    type: UpdateBankingDto,
    description:
      'How to update a banking by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          bankName: 'test11',
          currencyId: 1,
          ledgerId: 6,
          accountCode: 'test11',
          bankAccountName: 'test11',
          accountNumber: 'test11',
          openingBalance: 1000.2,
          accountType: 1000,
          description: 'test11',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a Banking account required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateBankingDto: UpdateBankingDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.bankingService.updateBankAccount(
      updateBankingDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single banking account
  @ApiOperation({
    summary: 'find single banking account by id',
    description:
      'this route is responsible for find single banking account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single banking account required id',
    required: true,
  })
  @Get(':id')
  async findSingleBankingAcc(@Param('id') id: number) {
    const data = await this.bankingService.findOneBanking(id);
    return { message: 'successful!', result: data };
  }

  // get all banking data with paginaiton
  @ApiOperation({
    summary: 'get all banking data with pagination',
    description:
      'this route is responsible for getting all banking data with pagination',
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
    const result = await this.bankingService.findAllBankingData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single banking account
  @ApiOperation({
    summary: 'delete single banking account by id',
    description:
      'this route is responsible for delete single banking account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single banking account required id',
    required: true,
  })
  @Delete(':id')
  async deleteBankingAcc(@Param('id') id: number) {
    const data = await this.bankingService.deleteBanking(id);
    return { message: 'successful!', result: data };
  }
}

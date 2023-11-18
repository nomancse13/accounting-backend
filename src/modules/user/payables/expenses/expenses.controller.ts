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
import { ExpensesService } from './expenses.service';
import { CreateExpensesDto, UpdateExpensesDto } from './dtos';

@ApiTags('User|Expenses')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'expenses',
  version: '1',
})
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  //   create a new expenses
  @ApiOperation({
    summary: 'create expenses by a user',
    description: 'this route is responsible for create a expenses',
  })
  @ApiBody({
    type: CreateExpensesDto,
    description:
      'How to create a expenses with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter expenses',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          expenseAmount: 6,
          ledgerExpenseId: 6,
          ledgerPaidId: 6,
          location: 'sdfjdofjdsfl',
          comment: 'sdfjdofjdsfl',
          refDoc: 'sdfjdofjdsfl',
        } as unknown as CreateExpensesDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createExpensesDto: CreateExpensesDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.expensesService.createExpense(
      createExpensesDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a expenses by id
  @ApiOperation({
    summary: 'update expenses by id',
    description: 'this route is responsible for update expenses by id',
  })
  @ApiBody({
    type: UpdateExpensesDto,
    description:
      'How to update a expenses by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          voucher: 'jsdhfdo',
          date: 'noman',
          expenseAmount: 6,
          ledgerExpenseId: 6,
          ledgerPaidId: 6,
          location: 'sdfjdofjdsfl',
          comment: 'sdfjdofjdsfl',
          refDoc: 'sdfjdofjdsfl',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a expenses required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateExpensesDto: UpdateExpensesDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.expensesService.updateExpenses(
      updateExpensesDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single expenses
  @ApiOperation({
    summary: 'find single expenses by id',
    description: 'this route is responsible for find single expenses by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single expenses required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data = await this.expensesService.findOneExpenses(id);
    return { message: 'successful!', result: data };
  }

  // get all expenses data with paginaiton
  @ApiOperation({
    summary: 'get all expenses data with pagination',
    description:
      'this route is responsible for getting all expenses data with pagination',
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
    const result = await this.expensesService.findAllExpensesData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single expenses
  @ApiOperation({
    summary: 'delete single expenses by id',
    description: 'this route is responsible for delete single expenses by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single expenses required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.expensesService.deleteExpenses(id);
    return { message: 'successful!', result: data };
  }
}

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
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto, UpdateReceiptDto } from './dtos';

@ApiTags('User|Receipt')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'receipt',
  version: '1',
})
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  //   create a new receipt
  @ApiOperation({
    summary: 'create receipt by a user',
    description: 'this route is responsible for create a receipt',
  })
  @ApiBody({
    type: CreateReceiptDto,
    description:
      'How to create a receipt with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter receipt',
        value: {
          voucher: 'jsdhfdo',
          date: '2/9/23',
          dueAmount: 283,
          transactionNo: 34355,
          refDoc: 'syedpur',
          paymentMethod: 1,
          narration: 6,
          customerId: 2,
          accountId: 2,
        } as unknown as CreateReceiptDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createReceiptDto: CreateReceiptDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.receiptService.createReceipt(
      createReceiptDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a receipt by id
  @ApiOperation({
    summary: 'update receipt by id',
    description: 'this route is responsible for update receipt by id',
  })
  @ApiBody({
    type: UpdateReceiptDto,
    description:
      'How to update a receipt by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          voucher: 'jsdhfdo',
          date: '2/9/23',
          dueAmount: 283,
          transactionNo: 34355,
          refDoc: 'syedpur',
          paymentMethod: 1,
          narration: 6,
          customerId: 2,
          accountId: 2,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a receipt required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateReceiptDto: UpdateReceiptDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.receiptService.updateReceipt(
      updateReceiptDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single receipt
  @ApiOperation({
    summary: 'find single receipt by id',
    description: 'this route is responsible for find single receipt by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single receipt required id',
    required: true,
  })
  @Get(':id')
  async findSingle(@Param('id') id: number) {
    const data = await this.receiptService.findOneReceiptData(id);
    return { message: 'successful!', result: data };
  }

  // get all sale receipt data with paginaiton
  @ApiOperation({
    summary: 'get all receipt data with pagination',
    description:
      'this route is responsible for getting all receipt data with pagination',
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
    const result = await this.receiptService.findAllReceiptData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single receipt
  @ApiOperation({
    summary: 'delete single receipt by id',
    description: 'this route is responsible for delete single receipt by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single receipt required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.receiptService.deleteReceipt(id);
    return { message: 'successful!', result: data };
  }
}

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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dtos';

@ApiTags('User|Invoice')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'invoice',
  version: '1',
})
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  //   create a new invoice
  @ApiOperation({
    summary: 'create invoice by a user',
    description: 'this route is responsible for create a invoice',
  })
  @ApiBody({
    type: CreateInvoiceDto,
    description:
      'How to create a invoice with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter invoice',
        value: {
          invoiceNo: 'jsdhfdo',
          transactionID: 'noman',
          comment: '0192938283',
          reference: 'jamn',
          creditAmount: 1.33,
          debitAmount: 1,
          purchaseAverageRate: 6,
          conversionRate: 6,
          reverseRate: 6,
          debitCurrencyRate: 6,
          creditCurrencyRate: 6,
          debitRateBase: 6,
          creditRateBase: 6,
          totalDueAmount: 6,
          paymentStatus: 6,
          debitLedgerId: 6,
          creditLedgerId: 6,
          debitCurrencyId: 6,
          creditCurrencyId: 6,
        } as unknown as CreateInvoiceDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.invoiceService.createInvoice(
      createInvoiceDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a invoice by id
  @ApiOperation({
    summary: 'update invoice by id',
    description: 'this route is responsible for update invoice by id',
  })
  @ApiBody({
    type: UpdateInvoiceDto,
    description:
      'How to update a invoice by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          invoiceNo: 'jsdhfdo',
          transactionID: 'noman',
          comment: '0192938283',
          reference: 'jamn',
          creditAmount: 1.33,
          debitAmount: 1,
          purchaseAverageRate: 6,
          conversionRate: 6,
          reverseRate: 6,
          debitCurrencyRate: 6,
          creditCurrencyRate: 6,
          debitRateBase: 6,
          creditRateBase: 6,
          totalDueAmount: 6,
          paymentStatus: 6,
          debitLedgerId: 6,
          creditLedgerId: 6,
          debitCurrencyId: 6,
          creditCurrencyId: 6,
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a invoice required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.invoiceService.updateInvoice(
      updateInvoiceDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single invoice
  @ApiOperation({
    summary: 'find single invoice by id',
    description: 'this route is responsible for find single invoice by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single invoice required id',
    required: true,
  })
  @Get(':id')
  async findSingleInvoice(@Param('id') id: number) {
    const data = await this.invoiceService.findOneInvoice(id);
    return { message: 'successful!', result: data };
  }

  // get all invoice data with paginaiton
  @ApiOperation({
    summary: 'get all invoice data with pagination',
    description:
      'this route is responsible for getting all invoice data with pagination',
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
  async getAllInvoice(
    @Query() listQueryParam: PaginationOptionsInterface,
    @Query('filter') filter: any,
    @UserPayload() userPayload: UserInterface,
  ) {
    const result = await this.invoiceService.findAllInvoiceData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single invoice account
  @ApiOperation({
    summary: 'delete single invoice account by id',
    description:
      'this route is responsible for delete single invoice account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single invoice account required id',
    required: true,
  })
  @Delete(':id')
  async deleteInvoice(@Param('id') id: number) {
    const data = await this.invoiceService.deleteInvoice(id);
    return { message: 'successful!', result: data };
  }
}

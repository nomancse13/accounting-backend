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
import { SupplierInvoiceService } from './supplier-invoice.service';
import { CreateSupplierInvoiceDto, UpdateSupplierInvoiceDto } from './dtos';

@ApiTags('User|Supplier Invoice')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'supplier/invoice',
  version: '1',
})
export class SupplierInvoiceController {
  constructor(private supplierInvoiceService: SupplierInvoiceService) {}

  //   create a new supplier invoice
  @ApiOperation({
    summary: 'create supplier invoice by a user',
    description: 'this route is responsible for create a supplier invoice',
  })
  @ApiBody({
    type: CreateSupplierInvoiceDto,
    description:
      'How to create a supplier invoice with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter supplier invoice',
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
        } as unknown as CreateSupplierInvoiceDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createSupplierInvoiceDto: CreateSupplierInvoiceDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.supplierInvoiceService.createSupplierInvoice(
      createSupplierInvoiceDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a supplier invoice by id
  @ApiOperation({
    summary: 'update supplier invoice by id',
    description: 'this route is responsible for update supplier invoice by id',
  })
  @ApiBody({
    type: UpdateSupplierInvoiceDto,
    description:
      'How to update a supplier invoice by id?... here is the example given below!',
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
    description: 'for update a supplier invoice required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateSupplierInvoiceDto: UpdateSupplierInvoiceDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.supplierInvoiceService.updateSupplierInvoice(
      updateSupplierInvoiceDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single supplier invoice
  @ApiOperation({
    summary: 'find single supplier invoice by id',
    description:
      'this route is responsible for find single supplier invoice by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single supplier invoice required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.supplierInvoiceService.findOneSupplierInvoice(id);
    return { message: 'successful!', result: data };
  }

  // get all supplier invoice data with paginaiton
  @ApiOperation({
    summary: 'get all supplier invoice data with pagination',
    description:
      'this route is responsible for getting all supplier invoice data with pagination',
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
    const result = await this.supplierInvoiceService.findAllSupplierInvoiceData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single supplier invoice account
  @ApiOperation({
    summary: 'delete single supplier invoice account by id',
    description:
      'this route is responsible for delete single supplier invoice account by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single supplier invoice account required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.supplierInvoiceService.deleteSupplierInvoice(id);
    return { message: 'successful!', result: data };
  }
}

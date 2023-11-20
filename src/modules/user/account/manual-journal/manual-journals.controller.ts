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
import { ManualJournalsService } from './manual-journals.service';
import { CreateManualJounalsDto, UpdateManualJounalsDto } from './dtos';

@ApiTags('User|Manual Journals')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'manual/journals',
  version: '1',
})
export class ManualJournalsController {
  constructor(private manualJournalsService: ManualJournalsService) {}

  //   create a new manual journals
  @ApiOperation({
    summary: 'create manual journals by a user',
    description: 'this route is responsible for create a new manual journals',
  })
  @ApiBody({
    type: CreateManualJounalsDto,
    description:
      'How to create a manual journals with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter manual journals',
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
        } as unknown as CreateManualJounalsDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createManualJounalsDto: CreateManualJounalsDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.manualJournalsService.createManualJournals(
      createManualJounalsDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a manual Journals by id
  @ApiOperation({
    summary: 'update manual Journals by id',
    description: 'this route is responsible for update manual Journals by id',
  })
  @ApiBody({
    type: UpdateManualJounalsDto,
    description:
      'How to update a manual Journals by id?... here is the example given below!',
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
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a manual Journals required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateManualJounalsDto: UpdateManualJounalsDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.manualJournalsService.updateManualJournals(
      updateManualJounalsDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single manual journals
  @ApiOperation({
    summary: 'find single manual journals by id',
    description:
      'this route is responsible for find single manual journals by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single manual journals required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.manualJournalsService.findOneManualJournalData(id);
    return { message: 'successful!', result: data };
  }

  // get all manual journals data with paginaiton
  @ApiOperation({
    summary: 'get all manual journals data with pagination',
    description:
      'this route is responsible for getting all manual journals data with pagination',
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
    const result = await this.manualJournalsService.findAllManualjournalData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single manual journals
  @ApiOperation({
    summary: 'delete single manual journals by id',
    description:
      'this route is responsible for delete single manual journals by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single manual journals required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.manualJournalsService.deleteManuaJournal(id);
    return { message: 'successful!', result: data };
  }
}

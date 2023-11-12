import { UserGuard } from 'src/authentication/auth/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { LedgersService } from './ledgers.service';
import { CreateLedgersDto, UpdateLedgersDto } from './dtos';
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';

@ApiTags('User|Ledgers')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'ledger',
  version: '1',
})
export class LedgerController {
  constructor(private ledgersService: LedgersService) {}

  //   create a new ledger
  @ApiOperation({
    summary: 'create ledgers by a user',
    description: 'this route is responsible for create a ledgers',
  })
  @ApiBody({
    type: CreateLedgersDto,
    description:
      'How to create a ledgers with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter ledger info',
        value: {
          ledgerName: 'test11',
          ledgerParent: 1,
          ledgerType: 'test',
          nature: 'test',
          accountOpeningBalance: 1,
          openingBalance: 1,
          closingBalance: 1,
          currencyId: 1,
        } as unknown as CreateLedgersDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createLedgersDto: CreateLedgersDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.ledgersService.createLedger(
      createLedgersDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update a ledger by id
  @ApiOperation({
    summary: 'update a ledger by id',
    description: 'this route is responsible for update a ledger by id',
  })
  @ApiBody({
    type: UpdateLedgersDto,
    description:
      'How to update a ledger by id?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          organisationName: 'test11',
          organisationType: 'test',
          organizationLogo: 'test',
          licenseExpired: 'test',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update a ledger required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateOrganizationsDto: UpdateLedgersDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.ledgersService.updateLedger(
      updateOrganizationsDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single ledger
  @ApiOperation({
    summary: 'find single ledger by id',
    description: 'this route is responsible for find single ledger by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single ledger required id',
    required: true,
  })
  @Get(':id')
  async findledger(@Param('id') id: number) {
    const data = await this.ledgersService.findOneLedger(id);
    return { message: 'successful!', result: data };
  }

  // get all ledger data with paginaiton
  @ApiOperation({
    summary: 'get all ledger data with pagination',
    description:
      'this route is responsible for getting all ledger data with pagination',
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
  async apiPlanData(
    @Query() listQueryParam: PaginationOptionsInterface,
    @Query('filter') filter: any,
    @UserPayload() userPayload: UserInterface,
  ) {
    const result = await this.ledgersService.findAllLedger(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single ledger
  @ApiOperation({
    summary: 'delete single ledger by id',
    description: 'this route is responsible for delete single ledger by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single ledger required id',
    required: true,
  })
  @Delete(':id')
  async deleteApiPlan(@Param('id') id: number) {
    const data = await this.ledgersService.deleteLedger(id);
    return { message: 'successful!', result: data };
  }
}

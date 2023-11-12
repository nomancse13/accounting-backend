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
import { CreateOrganizationsDto, UpdateOrganizationsDto } from './dtos';
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';
import { OrganizationsService } from './organizations.service';

@ApiTags('User|Organizations')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'organizations',
  version: '1',
})
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  //   create a new organizations
  @ApiOperation({
    summary: 'create organizations by a user',
    description: 'this route is responsible for create a organizations',
  })
  @ApiBody({
    type: CreateOrganizationsDto,
    description:
      'How to create a organizations with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter ledger info',
        value: {
          organisationName: 'test11',
          organisationType: 'test',
          organizationLogo: 'test',
          licenseExpired: 'test',
        } as unknown as CreateOrganizationsDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createOrganizationsDto: CreateOrganizationsDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.organizationsService.createOrganizations(
      createOrganizationsDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an organaization by id
  @ApiOperation({
    summary: 'update organaization by id',
    description: 'this route is responsible for update organaization by id',
  })
  @ApiBody({
    type: UpdateOrganizationsDto,
    description:
      'How to update an organaization by id?... here is the example given below!',
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
    description: 'for update a Organizations required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateOrganizationsDto: UpdateOrganizationsDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.organizationsService.updateOrganizations(
      updateOrganizationsDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single Organizations
  @ApiOperation({
    summary: 'find single Organizations by id',
    description:
      'this route is responsible for find single Organizations by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single Organizations required id',
    required: true,
  })
  @Get(':id')
  async findOrganizations(@Param('id') id: number) {
    const data = await this.organizationsService.findOneOrganizations(id);
    return { message: 'successful!', result: data };
  }

  // get all organization data with paginaiton
  @ApiOperation({
    summary: 'get all organization data with pagination',
    description:
      'this route is responsible for getting all organization data with pagination',
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
    const result = await this.organizationsService.findAllOrganizations(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single Organizations
  @ApiOperation({
    summary: 'delete single Organizations by id',
    description:
      'this route is responsible for delete single Organizations by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single Organizations required id',
    required: true,
  })
  @Delete(':id')
  async deleteOrganizations(@Param('id') id: number) {
    const data = await this.organizationsService.deleteOrganizations(id);
    return { message: 'successful!', result: data };
  }
}

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
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';
import { UpdateOrganizationsDto } from '../../configurations/organizations/dtos';
import { DesignationService } from './designation.service';
import { CreateDesignationDto, UpdateDesignationDto } from './dtos';

@ApiTags('User|Designation')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'designation',
  version: '1',
})
export class DesignationController {
  constructor(private designationService: DesignationService) {}

  //   create a new designation
  @ApiOperation({
    summary: 'create designation by a user',
    description: 'this route is responsible for create a designation',
  })
  @ApiBody({
    type: CreateDesignationDto,
    description:
      'How to create a designation with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter designation info',
        value: {
          note: 'this is for designation note',
          designationName: 'noman',
        } as unknown as CreateDesignationDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createDesignationDto: CreateDesignationDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.designationService.createdesignation(
      createDesignationDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an designation by id
  @ApiOperation({
    summary: 'update designation by id',
    description: 'this route is responsible for update designation by id',
  })
  @ApiBody({
    type: UpdateDesignationDto,
    description:
      'How to update an designation by id?... here is the example given below!',
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
    description: 'for update a designation required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateDesignationDto: UpdateDesignationDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.designationService.updatedesignation(
      updateDesignationDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single designation
  @ApiOperation({
    summary: 'find single designation by id',
    description: 'this route is responsible for find single designation by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single designation required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.designationService.findOnedesignation(id);
    return { message: 'successful!', result: data };
  }

  // get all designation data with paginaiton
  @ApiOperation({
    summary: 'get all designation data with pagination',
    description:
      'this route is responsible for getting all designation data with pagination',
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
    const result = await this.designationService.findAlldesignation(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single designation
  @ApiOperation({
    summary: 'delete single designation by id',
    description:
      'this route is responsible for delete single designation by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single designation required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.designationService.deletedesignation(id);
    return { message: 'successful!', result: data };
  }
}

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
import { EmployeeService } from './employee.service';
import { CreateEmployeesDto, UpdateEmployeesDto } from './dtos';

@ApiTags('User|Employee')
@ApiBearerAuth('jwt')
@UseGuards(UserGuard)
@Controller({
  path: 'employee',
  version: '1',
})
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  //   create a new employee
  @ApiOperation({
    summary: 'create employee by a user',
    description: 'this route is responsible for create a employee',
  })
  @ApiBody({
    type: CreateEmployeesDto,
    description:
      'How to create a employee with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'enter employee info',
        value: {
          groupName: 'test11',
          groupParentId: 1,
          groupIdentifier: 'test',
          groupType: 'test',
          nature: 'test',
          postedTo: 'test',
          groupHeadType: 'test',
        } as unknown as CreateEmployeesDto,
      },
    },
  })
  @Post()
  async create(
    @Body() createEmployeesDto: CreateEmployeesDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.employeeService.createEmployees(
      createEmployeesDto,
      userPayload,
    );

    return { message: 'successful!', result: data };
  }

  // update an employee by id
  @ApiOperation({
    summary: 'update employee by id',
    description: 'this route is responsible for update employee by id',
  })
  @ApiBody({
    type: UpdateEmployeesDto,
    description:
      'How to update an employee by id?... here is the example given below!',
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
    description: 'for update a employee required id',
    required: true,
  })
  @Patch(':id')
  async update(
    @Body() updateEmployeesDto: UpdateEmployeesDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.employeeService.updateEmployees(
      updateEmployeesDto,
      userPayload,
      id,
    );
    return { message: 'successful!', result: data };
  }

  // find single employee
  @ApiOperation({
    summary: 'find single employee by id',
    description: 'this route is responsible for find single employee by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'find single employee required id',
    required: true,
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.employeeService.findOneEmployeesData(id);
    return { message: 'successful!', result: data };
  }

  // get all employee data with paginaiton
  @ApiOperation({
    summary: 'get all employee data with pagination',
    description:
      'this route is responsible for getting all employee data with pagination',
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
    const result = await this.employeeService.findAllEmployeesData(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // delete single employee
  @ApiOperation({
    summary: 'delete single employee by id',
    description: 'this route is responsible for delete single employee by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'delete single employee required id',
    required: true,
  })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.employeeService.deleteEmployees(id);
    return { message: 'successful!', result: data };
  }
}

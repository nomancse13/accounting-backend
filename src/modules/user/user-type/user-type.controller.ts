import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UserTypeService } from './user-type.service';
import { UserGuard } from 'src/authentication/auth/guards';
import { UserInterface } from 'src/authentication/common/interfaces';
import { UserPayload } from 'src/authentication/utils/decorators';
import {
  CreateUserTypeDto,
  DeleteUserTypeDto,
  UpdateUserTypeDto,
} from '../dtos';

@ApiTags('Users Type')
@ApiBearerAuth('jwt')
// GUARDS
@UseGuards(UserGuard)
@Controller({
  // path name:
  path: 'user-type',
  // route version
  version: '1',
})
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  /**
   * create new user type
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new User Type',
    description: 'This route is responsible for crating a new User Type',
  })
  @ApiBody({
    type: CreateUserTypeDto,
    description:
      'How to create a new user type with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          userTypeName: 'Student',
          slug: 'student',
        } as unknown as CreateUserTypeDto,
      },
    },
  })
  async create(
    @Body() userTypeData: CreateUserTypeDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.userTypeService.create(userTypeData, userPayload);
    return { message: 'Successful', result: data };
  }

  /**
   * GET all User Type data
   */
  @Get()
  @ApiOperation({
    summary: 'Get all User Type list',
    description: 'This route is responsible for getting all User Type list',
  })
  async findAll(@UserPayload() userPayload: UserInterface) {
    const data = await this.userTypeService.findAll(userPayload);
    return { message: 'Successful', result: data };
  }

  /**
   * Get One User Type
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get one User Type data',
    description: 'This route is responsible for getting single User Type data',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for single fetch, required id',
    required: true,
  })
  async findOne(
    @Param('id') id: number,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.userTypeService.findOneResult(id, userPayload);

    return { message: 'Successful', result: data };
  }

  /**
   * update User Type
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update User Type data',
    description: 'This route is responsible for updating a User Type data',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'for update, required id',
    required: true,
  })
  @ApiBody({
    type: UpdateUserTypeDto,
    description:
      'How to update a new user type with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          userTypeName: 'Student',
          slug: 'student',
        } as unknown as UpdateUserTypeDto,
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() userTypeData: UpdateUserTypeDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const updatedResult = await this.userTypeService.update(
      id,
      userTypeData,
      userPayload,
    );
    return { message: 'successful', result: updatedResult };
  }

  /**
   * remove User Type
   */
  @Patch()
  @ApiOperation({
    summary: 'Remove User Type data',
    description:
      'This route is responsible for Removing one or more User Type data from User Type list',
  })
  @ApiBody({
    type: DeleteUserTypeDto,
    examples: {
      a: {
        summary: 'default',
        description: ' remove one or more existing user type ',
        value: {
          deleteIds: [1],
        } as unknown as DeleteUserTypeDto,
      },
    },
  })
  async remove(
    @Body() deletedData: DeleteUserTypeDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const deletedDataResult = await this.userTypeService.remove(
      deletedData,
      userPayload,
    );
    return { message: 'successful', result: deletedDataResult };
  }

  /**
   * hard delete User Type data
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'delete module',
    description:
      'This route is responsible is for completely delete from database',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Delete single user type by id',
    required: true,
  })
  async delete(
    @Param('id') id: number,
    @UserPayload() userPayload: UserInterface,
  ) {
    const deletedDataResult = await this.userTypeService.delete(
      id,
      userPayload,
    );
    return { message: 'successful', result: deletedDataResult };
  }
}

/**dependencies */
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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/authentication/auth/auth.service';
import { AuthDto, LoginDto } from 'src/authentication/auth/dto';
import { UpdateUserDto } from 'src/authentication/auth/dto/update-user.dto';
import { UserGuard } from 'src/authentication/auth/guards';
import { RtGuard } from 'src/authentication/auth/guards/rt.guard';
import {
  PaginationOptionsInterface,
  UserInterface,
} from 'src/authentication/common/interfaces';
import { PublicRoute, UserPayload } from 'src/authentication/utils/decorators';

//guard
@ApiTags('ADMIN')
@Controller({
  //path name
  path: '',
  //version
  version: '1',
})
export class UserController {
  constructor(
    private readonly authService: AuthService, // private readonly userService: UserService,
  ) {}

  // signup route
  @PublicRoute()
  @ApiOperation({
    summary: 'registration a system user',
    description: 'this route is responsible for register a system user',
  })
  @ApiBody({
    type: AuthDto,
    description:
      'How to register a system user with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          name: 'rahan',
          email: 'rahan@gmail.com',
          mobile: '+8801718890326',
          address: 'syedpur',
          password: '123456',
        } as unknown as AuthDto,
      },
    },
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(@Body() dto: AuthDto) {
    const data = await this.authService.signupAdminUser(dto);

    return { message: 'Successful', result: data };
  }

  // user registration
  @UseGuards(UserGuard)
  @ApiOperation({
    summary: 'create a user',
    description: 'this route is responsible for create user',
  })
  @ApiBody({
    type: AuthDto,
    description:
      'How to create user with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          name: 'Md Noman',
          mobile: '085454534',
          gender: 'male',
          email: 'user@gmail.com',
          password: 'password',
          userType: 'user',
        } as unknown as AuthDto,
      },
    },
  })
  @Post('create')
  async create(
    @Body() authDto: AuthDto,
    @UserPayload() userPayload: UserInterface,
  ) {
    const data = await this.authService.createUser(authDto, userPayload);

    return { message: 'Successful', result: data };
  }

  // signin route

  @PublicRoute()
  @ApiOperation({
    summary: 'for login, use this api',
    description: 'this route is responsible for login a system user',
  })
  @ApiBody({
    type: LoginDto,
    description:
      'How to login as an admin with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          email: 'rahan@gmail.com',
          password: '123456',
          // userType: 'admin',
        } as unknown as LoginDto,
      },
    },
  })
  @PublicRoute()
  @Post('local/signin')
  async signinLocal(@Body() dto: LoginDto): Promise<any> {
    const data = await this.authService.signinUser(dto);
    return { message: 'Successful', result: data };
  }

  /**
   *  UPDATE USER Profile
   */
  @ApiBearerAuth('jwt')
  @UseGuards(UserGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a User data',
    description: 'This route is responsible for updating a User',
  })
  @ApiBody({
    type: UpdateUserDto,
    description:
      'How to update an user with body?... here is the example given below!',
    examples: {
      a: {
        summary: 'default',
        value: {
          name: 'Md Noman',
          mobile: '085454534',
          gender: 'male',
          email: 'user@gmail.com',
          password: 'password',
          userTypeId: 2,
          ledgerId: 2,
          currencyId: 1,
        } as unknown as UpdateUserDto,
      },
    },
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UserPayload() userPayload: UserInterface,
    @Param('id') id: number,
  ) {
    const data = await this.authService.updateUserProfile(
      updateUserDto,
      userPayload,
      id,
    );
    return { message: 'Successful', result: data };
  }

  // refresh the access token of admin

  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'access token need to be refreshed',
    description: 'this route is responsible for access token refreshed',
  })
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @UserPayload() user: UserInterface,
    @UserPayload('refreshToken') refreshToken: string,
  ): Promise<any> {
    const data = await this.authService.refreshTokensUser(
      user.id,
      refreshToken,
    );

    return { message: 'Successful', result: data };
  }

  // pagination all user data
  @ApiOperation({
    summary: 'pagination of all user data',
    description: 'this route is responsible for pagination of all user data',
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
  @Get('all/user')
  @UseGuards(UserGuard)
  async allUser(
    @Query() listQueryParam: PaginationOptionsInterface,
    @Query('filter') filter: any,
    @UserPayload() userPayload: UserInterface,
  ) {
    const result = await this.authService.findAllUser(
      listQueryParam,
      filter,
      userPayload,
    );

    return { message: 'successful', result: result };
  }

  // // show all user data
  // @ApiBearerAuth('jwt')
  // @ApiOperation({
  //   summary: 'show all user data',
  //   description:
  //     'this route is responsible for showing paginated all user data',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   type: Number,
  //   description: 'insert limit if you need',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'page',
  //   type: Number,
  //   description: 'insert page if you need',
  //   required: false,
  // })
  // @ApiQuery({
  //   name: 'filter',
  //   type: String,
  //   description: 'insert filter if you need',
  //   required: false,
  // })
  // @UseGuards(AdminGuard)
  // @Get('/all/user')
  // async getAllUserData(
  //   @Query() listQueryParam: PaginationOptionsInterface,
  //   @UserPayload() userPayload: UserInterface,
  //   @Query('filter') filter: any,
  // ) {
  //   const data = await this.subscriberUserService.showAllUser(
  //     listQueryParam,
  //     userPayload,
  //     filter,
  //   );
  //   return {
  //     message: 'successful!',
  //     result: data,
  //   };
  // }

  // // change status of user
  // @ApiBearerAuth('jwt')
  // @UseGuards(AdminGuard)
  // @Patch('/change/status/user')
  // @ApiOperation({
  //   summary: 'Status change one or more user',
  // })
  // @ApiBody({
  //   type: ChangeStatusDto,
  //   examples: {
  //     a: {
  //       summary: 'default',
  //       description: ' Status change one or more user',
  //       value: {
  //         ids: [1],
  //         status: 'Active || Inactive || Draft || Deleted || Banned',
  //       } as unknown as ChangeStatusDto,
  //     },
  //   },
  // })
  // async changeStatus(
  //   @Body() changeStatusDto: ChangeStatusDto,
  //   @UserPayload() userPayload: UserInterface,
  // ) {
  //   const data = await this.subscriberUserService.userStatusChange(
  //     changeStatusDto,
  //     userPayload,
  //   );

  //   return { message: 'Successful', result: data };
  // }

  // // for getting login to user from admin
  // @ApiOperation({
  //   summary: 'login to user from admin',
  //   description: 'this route is responsible for login to user from admin',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'for login to user require user id',
  //   required: true,
  // })
  // @ApiBearerAuth('jwt')
  // @UseGuards(AdminGuard)
  // @Get('login-user/:id')
  // async getToken(
  //   @Param('id') id: number,
  //   @UserPayload() userPayload: UserInterface,
  //   @IpPlusClientAddress() ipClientPayload: IpClientInterface,
  // ) {
  //   const data = await this.subscriberUserService.loginToUserFromAdmin(
  //     id,
  //     userPayload,
  //     ipClientPayload,
  //   );

  //   return {
  //     message: 'successful!',
  //     result: data,
  //   };
  // }

  // // user banned by admin

  // // @ApiOperation({
  // //   summary: 'for status changing of a subscriber user use this api',
  // //   description:
  // //     'this route is responsible for status changing of a subscriber user',
  // // })
  // // @ApiBearerAuth('jwt')
  // // @ApiBody({
  // //   type: UserBannedDto,
  // //   description:
  // //     'How to change status of a subscriber user with body?... here is the example given below!',
  // //   examples: {
  // //     a: {
  // //       summary: 'chaging status',
  // //       value: {
  // //         status: 'Banned',
  // //       } as unknown as UserBannedDto,
  // //     },
  // //   },
  // // })
  // // @ApiParam({
  // //   name: 'id',
  // //   type: Number,
  // //   description: 'for banned user required user id',
  // //   required: true,
  // // })
  // // @UseGuards(AdminGuard)
  // // @Patch('banned-user/:id')
  // // async bannedUser(
  // //   @Param('id') id: number,
  // //   @Body() userBannedDto: UserBannedDto,
  // //   @UserPayload() userPayload: UserInterface,
  // //   @IpPlusClientAddress() ipClientPayload: IpClientInterface,
  // // ) {
  // //   const data = await this.subscriberUserService.bannedUserByAdmin(
  // //     id,
  // //     userBannedDto,
  // //     userPayload,
  // //     ipClientPayload,
  // //   );

  // //   return { message: 'successful!', result: data };
  // // }

  // /**
  //  *  UPDATE SUBSCRIBER USER Profile
  //  */
  // @ApiBearerAuth('jwt')
  // @UseGuards(AdminGuard)
  // @Patch()
  // @ApiOperation({
  //   summary: 'Update single admin',
  //   description: 'This route is responsible for updating single admin',
  // })
  // @ApiBody({
  //   type: UpdateUserDto,
  //   description:
  //     'How to update admin with body?... here is the example given below!',
  //   examples: {
  //     a: {
  //       summary: 'default',
  //       value: {
  //         name: 'string',
  //         mobile: 'string',
  //         gender: 'female',
  //         maritalStatus: 'married',
  //         birthDate: '2022-03-02',
  //         address: 'string',
  //       } as unknown as UpdateUserDto,
  //     },
  //   },
  // })
  // async updateAdmin(
  //   @Body() updateUserDto: UpdateUserDto,
  //   @UserPayload() userPayload: UserInterface,
  // ) {
  //   const data = await this.authService.updateAdminProfile(
  //     updateUserDto,
  //     userPayload,
  //   );
  //   return { message: 'Successful', result: data };
  // }
}

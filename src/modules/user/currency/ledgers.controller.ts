// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { UserGuard } from 'src/authentication/auth/guards';

// @ApiTags('User|Ledgers')
// @ApiBearerAuth('jwt')
// @UseGuards(UserGuard)
// @Controller({
//   path: 'order',
//   version: '1',
// })
// export class OrderController {
//   constructor() {} // private priceFixingService: PriceFixingService,

//   // //   create a new order
//   // @ApiOperation({
//   //   summary: 'create order by a subscriber user',
//   //   description: 'this route is responsible for create a order',
//   // })
//   // @ApiBody({
//   //   type: CreateOrderDto,
//   //   description:
//   //     'How to buy a package Order with body?... here is the example given below!',
//   //   examples: {
//   //     a: {
//   //       summary: 'enter plan id from package',
//   //       value: {
//   //         planId: 51615,
//   //       } as unknown as CreateOrderDto,
//   //     },
//   //   },
//   // })
//   // @Post()
//   // async create(
//   //   @Body() createOrderDto: CreateOrderDto,
//   //   @UserPayload() userPayload: UserInterface,
//   // ) {
//   //   const data = await this.orderService.createOrderLink(
//   //     createOrderDto,
//   //     userPayload,
//   //   );

//   //   return { message: 'successful!', result: data };
//   // }

//   // // ******* API PLAN Order api ************

//   // //   create a new api plan Order
//   // @ApiOperation({
//   //   summary: 'create api plan Order by a subscriber user',
//   //   description: 'this route is responsible for create a api plan Order',
//   // })
//   // @ApiBody({
//   //   type: CreateOrderDto,
//   //   description:
//   //     'How to buy an api plan Order with body?... here is the example given below!',
//   //   examples: {
//   //     a: {
//   //       summary: 'enter api plan id from package',
//   //       value: {
//   //         planId: 51615,
//   //       } as unknown as CreateOrderDto,
//   //     },
//   //   },
//   // })
//   // @Post()
//   // async createPlanOrder(
//   //   @Body() createOrderDto: CreateOrderDto,
//   //   @UserPayload() userPayload: UserInterface,
//   // ) {
//   //   const data = await this.orderService.createApiPlanOrder(
//   //     createOrderDto,
//   //     userPayload,
//   //   );

//   //   return { message: 'successful!', result: data };
//   // }

//   // //   // get all price fixing data

//   // //   @ApiOperation({
//   // //     summary: 'get price fixing data',
//   // //     description: 'this route is responsible for get price fixing data',
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'limit',
//   // //     type: Number,
//   // //     description: 'insert limit if you need',
//   // //     required: false,
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'page',
//   // //     type: Number,
//   // //     description: 'insert page if you need',
//   // //     required: false,
//   // //   })
//   // //   @Get('price-fixing-module')
//   // //   async priceFixingData(
//   // //     @Query() listQueryParam: PaginationOptionsInterface,
//   // //     @Query() filter: any,
//   // //   ) {
//   // //     const result = await this.priceFixingService.paginatedPriceFixing(
//   // //       listQueryParam,
//   // //       filter,
//   // //     );

//   // //     return { message: 'successful', result: result };
//   // //   }

//   // //   // get all package data

//   // //   @ApiOperation({
//   // //     summary: 'get package data',
//   // //     description: 'this route is responsible for get package data',
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'limit',
//   // //     type: Number,
//   // //     description: 'insert limit if you need',
//   // //     required: false,
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'page',
//   // //     type: Number,
//   // //     description: 'insert page if you need',
//   // //     required: false,
//   // //   })
//   // //   @Get('/avail/plan')
//   // //   async packageData(
//   // //     @Query() listQueryParam: PaginationOptionsInterface,
//   // //     @UserPayload() userPayload: UserInterface,
//   // //   ) {
//   // //     const result = await this.orderService.paginatedAvailPlan(
//   // //       listQueryParam,
//   // //       userPayload,
//   // //     );

//   // //     return { message: 'successful', result: result };
//   // //   }

//   // //   // get all package data

//   // //   @ApiOperation({
//   // //     summary: 'get package data',
//   // //     description: 'this route is responsible for getting my subscription plan',
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'limit',
//   // //     type: Number,
//   // //     description: 'insert limit if you need',
//   // //     required: false,
//   // //   })
//   // //   @ApiQuery({
//   // //     name: 'page',
//   // //     type: Number,
//   // //     description: 'insert page if you need',
//   // //     required: false,
//   // //   })
//   // //   @Get('/my/plan')
//   // //   async packageDataForMine(
//   // //     @Query() listQueryParam: PaginationOptionsInterface,
//   // //     @UserPayload() userPayload: UserInterface,
//   // //   ) {
//   // //     const result = await this.orderService.paginatedMyPlan(
//   // //       listQueryParam,
//   // //       userPayload,
//   // //     );

//   // //     return { message: 'successful', result: result };
//   // //   }

//   // //   // get single package by id

//   // //   @ApiOperation({
//   // //     summary: 'get single package by id',
//   // //     description: 'this route is responsible for getting single package by id',
//   // //   })
//   // //   @ApiParam({
//   // //     name: 'id',
//   // //     type: Number,
//   // //     description: 'For getting single package required id',
//   // //     required: true,
//   // //   })
//   // //   @Get('package/:id')
//   // //   async singleGet(@Param('id') id: number) {
//   // //     const data = await this.orderService.getPackageById(id);
//   // //     return { message: 'successful!', result: data };
//   // //   }

//   // //   //   create new custom package
//   // //   @ApiOperation({
//   // //     summary: 'create new custom package',
//   // //     description: 'this route is responsible for create new custom package',
//   // //   })
//   // //   @ApiBody({
//   // //     type: CreateCustomPackageDto,
//   // //     description:
//   // //       'How to buy new custom package with body?... here is the example given below!',
//   // //     examples: {
//   // //       a: {
//   // //         summary: 'enter plan id from package',
//   // //         value: {
//   // //           website: 5,
//   // //           domain: 5,
//   // //           ssl: 5,
//   // //           blacklist: 5,
//   // //           totalCost: 225,
//   // //           planType: 'month',
//   // //           planLength: 12,
//   // //         } as unknown as CreateCustomPackageDto,
//   // //       },
//   // //     },
//   // //   })
//   // //   @Post('custom-package')
//   // //   async createCustomPackage(
//   // //     @Body() createCustomPackageDto: CreateCustomPackageDto,
//   // //     @UserPayload() userPayload: UserInterface,
//   // //   ) {
//   // //     const data = await this.priceFixingService.createCustomPackage(
//   // //       createCustomPackageDto,
//   // //       userPayload,
//   // //     );

//   // //     return { message: 'successful!', result: data };
//   // //   }
// }

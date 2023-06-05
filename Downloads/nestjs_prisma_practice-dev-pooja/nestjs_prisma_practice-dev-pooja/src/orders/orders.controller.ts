import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Render, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
// import { Role } from 'src/roles/entities/role.entity';
import { Role } from 'src/auth/entities/role.enum';
import { Roles } from 'src/auth/entities/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req, @Res() res) {
    return this.ordersService.create(req,res)
    // return this.ordersService.create(createOrderDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/orderpage')
  @Roles(Role.USER)
  @Render('order_page')
  findAll(@Req() req, @Res() res) {
    return this.ordersService.findAll(req,res);
    
  }

   
  @UseGuards(JwtAuthGuard)
  @Get('/orderpage')
  @Roles(Role.ADMIN)
  @Render('dashboard')
  findAllOrders(@Req() req, @Res() res) {
    return this.ordersService.findAll(req,res);
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('/orderbyuser')
  @Roles(Role.USER)
  @Render('order_page')
  findOrdersByUser(@Req() req, @Res() res) {
    return this.ordersService.findOrderByUser(req,res);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(Role.USER)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

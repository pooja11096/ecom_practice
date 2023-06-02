import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Render } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req, @Res() res) {
    return this.ordersService.create(req,res)
    // return this.ordersService.create(createOrderDto);
  }

  @Get('orderpage')
  @Render('orderpage')
  findAll(@Req() req, @Res() res) {
    return this.ordersService.findAll(req,res);
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}

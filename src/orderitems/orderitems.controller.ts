import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Render,
} from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { Permissions } from 'src/auth/entities/permissions.decorator';
import { Permission } from 'src/auth/entities/permissions.enum';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
// import { OrderItem } from 'sequelize/types/model';
import { OrderItem } from 'sequelize';

@Controller('orderitems')
export class OrderitemsController {
  constructor(private readonly orderitemsService: OrderitemsService) {}

  @Post(':id')
  create(
    @Body() products: CreateOrderitemDto[],
    @Param('orderId') orderId: string,
  ) {
    return this.orderitemsService.create(orderId, products);
  }

  @Get()
  @Permissions(Permission.VIEW_ORDER)
  @Render('order_history')
  findAll(@Req() req) {
    return this.orderitemsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderitemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderitemDto: UpdateOrderitemDto,
  ) {
    return this.orderitemsService.update(+id, updateOrderitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderitemsService.remove(+id);
  }
}

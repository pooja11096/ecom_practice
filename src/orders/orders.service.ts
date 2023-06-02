import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {Request, Response} from 'express'


@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService){}

  async create(req: Request, res: Response) {
    
    try{
      const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
        );
      console.log(user.id);
      const uid = user.id;

      const subtotal = await this.prismaService.cart.findMany({where:{
        userId:uid
      }})
      var finaltotal=0;
      console.log("subtotal",subtotal);
      for(var i=0;i<subtotal.length;i++){
        var finaltotal = finaltotal+subtotal[i].total;
      }
      console.log("finaltotal",finaltotal);

      const order = await this.prismaService.order.create({
        data:{
          total:finaltotal,
          userId:uid
        }

      })

    console.log("order placed");
    res.redirect('/orders/orderpage')
        // console.log("update it");
      
      // const carts = await this.prismaService.cart.update({where:{id:cartItem.id}})
    }
    catch(err){
      throw err;
    }
    // return 'This action adds a new order';
  }

  async findAll(req:Request, res:Response) {
    const orders =  await this.prismaService.order.findMany({
      include:{
        user: true
      }
    })
    console.log(orders);
    return {orders}

    // return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}

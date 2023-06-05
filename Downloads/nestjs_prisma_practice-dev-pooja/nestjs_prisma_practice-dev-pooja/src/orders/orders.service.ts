import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {Request, Response} from 'express'
// import * as swal from 'sweetalert2'



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

        const cartItems = await this.prismaService.cart.findMany({
          where:{userId:uid}
        })

        console.log("dfgf",cartItems);
        
        for(var i=0;i< cartItems.length; i++){
          const orderItems = await this.prismaService.orderItem.create({
            data:{
              order: { connect: {id: order.id}},
              product:{connect: {id: cartItems[i].productId}},
              quantity: cartItems[i].quantity,
              total: cartItems[i].total
            }
          })
        }
        


  
      await this.prismaService.cart.deleteMany({where:{
        userId: uid
      }})

      res.redirect('/cart/cart_page')

      // await this.prismaService.orderItem.create({
      //   data:{
      //     quantity
      //   }
      // })
      
      // toastr.success('Have fun storming the castle!', 'Miracle Max Says')
    console.log("order placed");
    // res.send(order);
    // res.redirect('/orders/orderpage')
      }
   
    
    catch(err){
      throw err;
    }
  }

  async findAll(req:Request, res:Response) {
    
    const orders =  await this.prismaService.order.findMany({
      include:{
        user: true
      }
    })
    console.log(orders);
    return {orders}

  }

  async findOrderByUser(req:Request, res:Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
    console.log(user.id);
    const uid = user.id;
    const orders = await this.prismaService.order.findMany({
      where:{
        userId: uid
      },
      include:{
        orderItems: true
      }
      
    })
    console.log("orderbyuser", orders);
    
    return {orders}
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}

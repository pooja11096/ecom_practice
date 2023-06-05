import { Injectable } from '@nestjs/common';
// import { OrderItem } from 'sequelize/types/model';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';
import { OrderItem } from 'sequelize';
import { PrismaService } from 'prisma/prisma.service';
import { Request,Response } from 'express';

@Injectable()
export class OrderitemsService {
  constructor(private prismaService: PrismaService){}

  // prismaService: any;

  async create(orderId: string, products: CreateOrderitemDto[]){
    console.log("create orderitem");
    console.log(products);
    console.log("soid",orderId);
    
    const orderItems = products.map((p) => ({
      ...p,
      orderId
    }));
    console.log(orderItems);
    
    
    return this.prismaService.orderItem.createMany({
      data: orderItems
    })

    // return this.prismaService.orderItem.createMany({
    //   data: orderItems
    // })
  }

  async findAll(req: Request) {
    const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
        );
      console.log(user.id);
      const uid = user.id;
   const lastorder =  await this.prismaService.order.findFirst({
      where:{
        userId : uid,
      },
      orderBy:{
        createdAt: 'desc'
      },
      include:{
        orderItems:{
          select:{
            quantity:true,
            total: true,
            product: true
          }
        }
      }
    })
    console.log(lastorder);
    

    return {lastorder}
    // return `This action returns all orderitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderitem`;
  }

  update(id: number, updateOrderitemDto: UpdateOrderitemDto) {
    return `This action updates a #${id} orderitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderitem`;
  }
}

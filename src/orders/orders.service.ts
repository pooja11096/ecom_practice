import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request, Response } from 'express';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async create(req: Request, res: Response) {
    try {
      const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
      const uid = user.id;

      const subtotal = await this.prismaService.cart.findMany({
        where: {
          userId: uid,
        },
      });

      var finaltotal = 0;
      for (var i = 0; i < subtotal.length; i++) {
        var finaltotal = finaltotal + subtotal[i].total;
      }

      const order = await this.prismaService.order.create({
        data: {
          total: finaltotal,
          userId: uid,
        },
      });

      const cartItems = await this.prismaService.cart.findMany({
        where: { userId: uid },
      });


      for (var i = 0; i < cartItems.length; i++) {
        const orderItems = await this.prismaService.orderItem.create({
          data: {
            order: { connect: { id: order.id } },
            product: { connect: { id: cartItems[i].productId } },
            quantity: cartItems[i].quantity,
            total: cartItems[i].total,
          },
        });
      }

      await this.prismaService.cart.deleteMany({
        where: {
          userId: uid,
        },
      });

      res.redirect('/cart/cart_page');

    } catch (err) {
      throw err;
    }
  }

  async findAll(req: Request, res: Response) {
    const orders = await this.prismaService.order.findMany({
      include: {
        user: true,
      },
    });
    return { orders };
  }

  async findOrderByUser(req: Request, res: Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    const uid = user.id;
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: uid,
      },
      include: {
        orderItems: true,
      },
    });

    return { orders };
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async removeOrder(id: string) {
    return await this.prismaService.order.delete({where: {id:id}})
  }

  async pagination(req, res) {
    try {
     
      const page = req.query.page || 1;
      const perPage = 4;

      if (page > 0) {
        var skip = perPage * (page - 1);
      } else {
        var skip = 0;
      }
    
      const category = await this.prismaService.order.findMany({

        skip: skip,
        take: perPage,
        include: { user: true },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  async adminOrders(req,res){
    const total = await this.prismaService.order.count({
      
    });

    const page = req.query.page || 1;
    const perPage = 4;

    const skip = page > 0 ? perPage * (page - 1) : 0;

    const query = {
      include:{user: true},
      take: perPage,
      skip: skip,
    };
    const lastPage = Math.ceil(total / perPage);
    const orderlist = await this.prismaService.order.findMany(query)

    return {orderlist,lastPage}
    
  }


}

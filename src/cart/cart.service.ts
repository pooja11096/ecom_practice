import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request, Response } from 'express';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  create(createCartDto: CreateCartDto, req: Request, res: Response) {
    return this.prismaService.cart.create({ data: createCartDto });
    // return 'This action adds a new cart';
  }

  async addItemtoCart(
    productId: string,
    quantity: number,
    total: number,
    req: Request,
    res: Response,
  ) {
    try {
      const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
      const uid = user.id;

      const cartItem = await this.prismaService.cart.findFirst({
        where: { productId: productId, userId: uid },
      });

      if (!cartItem) {
        const carts = await this.prismaService.cart.create({
          data: {
            productId: productId,
            userId: uid,
            quantity: +quantity,
            total: +total,
          },
        });
        res.redirect('/cart/cart_page');
      } else {
        const upatecart = await this.prismaService.cart.update({
          where: { id: cartItem.id },
          data: {
            productId: productId,
            userId: uid,
            quantity: +(cartItem.quantity + quantity),
            total: +(cartItem.total + total),
          },
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async getAllCart(req: Request, res: Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );

    const uid = user.id;
    if (uid == undefined || uid == null) {
    } else {
      const carts = await this.prismaService.cart.findMany({
        where: { userId: uid },
        include: {
          user: true,
          product: true,
        },
      });

      res.render('cart', { carts });
    }
  }

  async clearCart(req: Request, res: Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    const uid = user.id;
    await this.prismaService.cart.deleteMany({
      where: {
        userId: uid,
      },
    });
  }

  async remove(id: string, req: Request, res: Response) {
    await this.prismaService.cart.delete({ where: { id: id } });
  }

  async getProductByCart(req: Request, res: Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    const uid = user.id;

    const pbycart = await this.prismaService.cart.findMany({
      select: {
        productId: true,
        quantity: true,
        total: true,
      },
      where: { userId: uid },
    });

    res.send(pbycart);
  }
}

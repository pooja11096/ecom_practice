import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {Request, Response} from 'express'

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService){}
  create(createCartDto: CreateCartDto,req: Request, res: Response) {
   
    return this.prismaService.cart.create({data:createCartDto})
    // return 'This action adds a new cart';
  }

  // async getPayload(){
  //   try{
  //     const user = JSON.parse(
  //       Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
  //       );
  //   console.log(user);
  //   }catch(err){
  //     throw err;
  //   }
  // }
  async addItemtoCart(productId: string, quantity: number,total: number, req: Request, res: Response){
    try{
      const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
        );
      console.log(user.id);
      const uid = user.id;
      // const jwt = req.cookies;
      // console.log('jwt', jwt);
      
    // const {quantity,total} = createCartDto;
   
    
    
    const cartItem = await this.prismaService.cart.findFirst({where:{productId: productId, userId:uid}})
    console.log("cartItem",cartItem);
    
    if(!cartItem){
      const carts = await this.prismaService.cart.create({
        data:{
          productId:productId,
          userId: uid,
          quantity:+quantity,
          total:+total
        }
      })
      console.log("heyyy");
      res.redirect('/cart/cart_page')
    }else{
      const upatecart = await this.prismaService.cart.update({
        where:{id:cartItem.id},
        data:{
          productId:productId,
          userId: uid,
          quantity:+(cartItem.quantity+quantity),
          total:+(cartItem.total+total)
        }
      })

      // const subtotal = await this.prismaService.cart.findMany({where:{
      //   userId:uid
      // }})
      // var finaltotal=0;
      // console.log("subtotal",subtotal);
      // for(var i=0;i<subtotal.length;i++){
      //   var finaltotal = finaltotal+subtotal[i].total;
      // }
      // console.log("finaltotal",finaltotal);
      // console.log("update it");
      
      // const carts = await this.prismaService.cart.update({where:{id:cartItem.id}})
    }
   
    }catch(err){
      throw err;
    }
    
  }

  async getAllCart(req: Request,res: Response ) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
    console.log(user.id);
    const uid = user.id;
    const carts =  await this.prismaService.cart.findMany({
      where:{userId:uid},
      include:{
        user: true,
        product: true
      },
      
    })
    console.log("get all cart");
    console.log("carts",carts);
    
    // console.log("carts",carts[1].product.image_url);
    
    return {carts}
    
    // return carts;
    // return `This action returns all cart`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} cart`;
  // }

  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }

  async clearCart(req: Request, res: Response){
    const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
        );
      console.log(user.id);
      const uid = user.id;
    await this.prismaService.cart.deleteMany({where:{
      userId: uid
    }})
  }

  async remove(id: string,req: Request,res: Response) {
    await this.prismaService.cart.delete({where:{id:id}})
    // res.redirect('/cart/cart_page');
    // return `This action removes a #${id} cart`;
  }

  async getProductByCart(req: Request, res: Response) {
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
    console.log(user.id);
    const uid = user.id;
    console.log("dfjskhg",await this.prismaService.cart.findMany({where:{userId: uid}}))

    const pbycart =  await this.prismaService.cart.findMany({
      select:{
        productId:true,
        quantity:true,
        total:true
      },
      where:{userId: uid}
    })

    res.send(pbycart)
  }
}

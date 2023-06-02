import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Render } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


  @Post('cart')
  async addToCart(@Body('productId') productId: string,@Body('quantity') quantity: number,@Body('total') total: number,@Req() req, @Res() res){
    return await this.cartService.addItemtoCart(productId,quantity,total,req,res);
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto,@Req() req, @Res() res) {
    // const {productId, userId,quantity} = createCartDto;

    // const cart = await this.cartService.
    return this.cartService.create(createCartDto, req, res);
  }

  // @Get('product_detail')
  // @Render('productDetails')
  // getUserToAddProducts(){
  //   return this.cartService.get
  // }

  @Get('/cart_page')
  @Render('cart')
  getCartPage(@Req() req, @Res() res){
    return this.cartService.getAllCart(req, res );
  }

  @Get()
  findAll() {
    // return this.cartService.getAllCart();
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req() req, @Res() res) {
    return this.cartService.remove(id,req,res);
  }
}

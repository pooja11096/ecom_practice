import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/entities/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { Permissions } from 'src/auth/entities/permissions.decorator';
import { Permission } from 'src/auth/entities/permissions.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cart')
  @Roles(Role.USER)
  async addToCart(
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
    @Body('total') total: number,
    @Req() req,
    @Res() res,
  ) {
    return await this.cartService.addItemtoCart(
      productId,
      quantity,
      total,
      req,
      res,
    );
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req, @Res() res) {
    return this.cartService.create(createCartDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.VIEW_CART)
  @Get('/cart_page')
  getCartPage(@Req() req, @Res() res) {
    return this.cartService.getAllCart(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(Role.USER)
  remove(@Param('id') id: string, @Req() req, @Res() res) {
    return this.cartService.remove(id, req, res);
  }

  @Get('/productbycart')
  productByCart(@Req() req, @Res() res) {
    return this.cartService.getProductByCart(req, res);
  }
}

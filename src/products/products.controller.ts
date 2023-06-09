import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
// import { CategoryService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/entities/roles.decorator';
import { Permissions, Role } from 'src/auth/entities/role.enum';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PrismaClient, Product } from '@prisma/client';
import { stringify } from 'querystring';
const prisma = new PrismaClient();

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Put('/upload/single/:id')
  updateProduct(
    @Param('id') id: string,
    @Body('product_name') product_name: string,
    @Body('product_description') product_description: string,
    @Body('product_price') product_price: number,
    @Body('catDropDown') categoryIds: string,
  ) {
    return this.productsService.updateProducts(
      id,
      product_name,
      product_description,
      product_price,
      categoryIds,
    );
  }

  @Post('/upload/single')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: diskStorage({
        destination: './public',
        filename(req, file, callback) {
          callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadSingleFile(
    @UploadedFile() file: any,
    @Body('product_name') name: string,
    @Body('product_description') description: string,
    @Body('product_price') price: number,
    @Body('categoriesDropDown') categoryIds: string,
  ) {
    return this.productsService.uploadSingleFile(
      file,
      name,
      description,
      price,
      categoryIds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  // @Roles(Role.ADMIN)
  // @Render('create_product')
  productData() {
    return this.productsService.findAllProductsAdmin();
  }

  @Get('/product_by_cat/:category_name')
  async productByCategory(
    @Param('category_name') category_name: string,
    @Res() res,
    @Req() req,
  ) {
    return await this.productsService.productByCategory(
      category_name,
      res,
      req,
    );
  }

  @Get('/user_product')
  // @Permissions(Permissions.CREATE)
  @Roles(Role.USER)
  @Render('shop')
  userProductPage(@Req() req, @Res() res) {
    return this.productsService.usersAllProducts(req, res);
  }

  @Get('p_page')
  @Roles(Role.ADMIN)
  @Render('create_product')
  productPage(@Req() req, @Res() res) {
    return this.productsService.findAllProducts(req, res);
  }

  // @Get('/product_details')
  // @Render('productDetails')
  // productDetailPage(@Req() req, @Res() res) {}

  @Get('product/edit/:id')
  findProduct(@Param('id') id: string) {
    return this.productsService.findProduct(id);
  }

  @Get('product/:id')
  @Render('productDetails')
  async findClickedProduct(@Param('id') id: string, @Req() req, @Res() res) {
    return await this.productsService.findProductById(id, req, res);
  }

  @Get('/cart/:id')
  @Render('productDetails')
  showProductInCart(@Param('id') id: string, @Req() req, @Res() res) {
    return this.productsService.findProductById(id, req, res);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // @Roles(Role.ADMIN)
  // update(
  //   @Param('id') id: string,
  //   @Body() updateProductDto: UpdateProductDto,
  //   @Req() req,
  //   @Res() res,
  // ) {
  //   return this.productsService.updateDaata(id, updateProductDto, req, res);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  // @Get('search')
  // async getSearchedResult(
  //   @Query('search') search: string,
  //   @Query('order') order: string,
  // ) {
  //   return this.productsService.searchedProduct(search, order);
  // }

  @Post('search-product')
  async Search(@Req() req, @Res() res) {
    console.log('user............', req.query.data);

    const data = await this.productsService.search(req.query, res);

    res.send(data);
  }

  @Post('sort-product')
  async Sort(@Req() req, @Res() res) {
    console.log('user', req.query.data);

    const data = await this.productsService.sort(req.query, res);

    res.send(data);
  }

  @Post('/page')
  async Pagination(@Req() req, @Res() res) {
    // console.log('findAll');

    const data = await this.productsService.pagination(req, res);

    console.log('pag wise data', data);

    res.send(data);
  }

  @Get('/pwc')
  pwc() {
    return this.productsService.proWithCat();
  }

  @Put('pwc/:id')
  proWithCat(
    @Param('id') productId: string,
    @Body('catDropDown') categoryId: string,
    @Body('product_name') product_name: string,
    @Body('product_description') product_description: string,
    @Body('product_price') product_price: number,
  ) {
    return this.productsService.updateProWithCat(
      productId,
      categoryId,
      product_name,
      product_description,
      product_price,
    );
  }

  @Delete('/dlt')
  deleteP(@Param('id') id: string) {
    return this.productsService.deleteP(id);
  }
}

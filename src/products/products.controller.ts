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
} from '@nestjs/common';
import { ProductsService } from './products.service';
// import { CategoryService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/entities/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':categoryId')
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
  create(
    @UploadedFile() file:any,
    @Body() createProductDto: CreateProductDto, @Param("categoryId") categoryId:string,@Req() req, @Res() res
  ) {
    console.log("file", file);
    
    const filePath = file.filename;
    return this.productsService.create(filePath, categoryId, createProductDto,req,res);
  }

 
 

  @Get('/user_product')
  @Render('shop')
  userProductPage(@Req() req, @Res() res) {
    return this.productsService.findAllProducts(req, res);
  }

  @Get('')
  @Roles(Role.ADMIN)
  @Render('products_crud')
  productData(@Req() req, @Res() res) {
    return this.productsService.findAllProducts(req, res);
  }

  // @Get()
  // // @Render('manage_users')
  // findAll(@Req() req, @Res() res) {
  //   return this.productsService.findAllProducts(req, res);
  // }

  @Get('/product_details')
  @Render('productDetails')
  productDetailPage(@Req() req, @Res() res){}

  @Get('/product/:id')
  findClickedProduct(@Param('id') id: string, @Req() req, @Res() res) {
    console.log("inside get product by id");
    
    return this.productsService.findProductById(id, req, res);
  }

  // @Get(':id')
  // @Render('productDetails')
  // findOne(@Param('id') id: string, @Req() req, @Res() res) {
  //   return this.productsService.findProductById(id, req, res);
  // }

  @Get('/cart/:id')
  @Render('productDetails')
  showProductInCart(@Param('id') id: string, @Req() req, @Res() res) {
    return this.productsService.findProductById(id, req, res);
  }

  @Put(':id')
  update( @Param('id') id: string,@Body() updateProductDto: UpdateProductDto,@Req() req, @Res() res)
  {
    return this.productsService.updateDaata(id,updateProductDto,req, res);
  }

  // @Put(':id')
  // @UseInterceptors(
  //   FileInterceptor('image_url', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename(req, file, callback) {
  //         callback(null, `${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // update(
  //   @UploadedFile() file: any,
  //   @Param('id') id: string,
  //   @Body() updateProductDto: UpdateProductDto,
  // ) {
  //   return this.productsService.updateProduct(file, id, updateProductDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}

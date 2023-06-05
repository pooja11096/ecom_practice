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
import { Role } from 'src/auth/entities/role.enum';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Query as ExpressQuery} from 'express-serve-static-core'
import { PrismaClient, Product } from '@prisma/client';
const prisma = new PrismaClient();

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


@Put('/upload/single/:id')
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
// @UseInterceptors(FileInterceptor('file'))
  updateProduct(
    @UploadedFile() file: any,
    @Param('id') id: string,
    @Body('product_name') product_name: string,
    @Body('product_description') product_description: string,
    @Body('product_price') product_price: string,
    @Body('catDropDown') categoryIds: string,
) {
  console.log("update p");
  
    console.log(file,product_name, product_description, product_price, categoryIds);
    return this.productsService.updateProducts(file,id,product_name, product_description, product_price, categoryIds);
}


  @Post('/upload/single')
    // @UseInterceptors(FileInterceptor('file'))
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
        @Body('product_price') price: string,
        @Body('categoriesDropDown') categoryIds: string,
    ) {
        console.log(file, name, description, price, categoryIds);
        return this.productsService.uploadSingleFile(file, name, description, price, categoryIds);
    }


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

  @UseGuards(JwtAuthGuard)
  @Post('/product/:categoryId')
  @Roles(Role.ADMIN)
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
  createP(
    @UploadedFile() file:any,
    @Body('product_name') product_name: string,
    @Body('product_description') product_description: string,
    @Body('product_price') product_price: string,
    @Param('categoryId') categoryId: string,
   @Req() req, @Res() res
  ) {
    console.log("file", file);
    
    const filePath = file.filename;
    return this.productsService.createP(filePath,product_name,product_description,product_price,categoryId,req,res);
  }



  @UseGuards(JwtAuthGuard)
  @Post('/product/cat')
  @Roles(Role.ADMIN)
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
  createPro(
    @UploadedFile() file:any,
    @Body('product_name') product_name: string,
    @Body('product_description') product_description: string,
    @Body('product_price') product_price: string,
    @Param('categoryId') categoryId: string,
   @Req() req, @Res() res
  ) {
    console.log("file", file);
    
    const filePath = file.filename;
    return this.productsService.createP(filePath,product_name,product_description,product_price,categoryId,req,res);
  }


 

 
  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(Role.ADMIN)
  // @Render('create_product')
  productData() {
    console.log("psss");
    
    return this.productsService.findAllProducts();
  }
  @Get('/product_by_cat/:category_name')
  // @Render('shop')
   async productByCategory(@Param('category_name') category_name: string, @Res() res, @Req() req){
    return await this.productsService.productByCategory(category_name,res,req);
    // return {products};
  }

  @Get('/user_product')
  @Render('shop')
  userProductPage(@Req() req, @Res() res) {
    return this.productsService.usersAllProducts(req,res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('p_page')
  @Roles(Role.ADMIN)
  @Render('create_product')
  productPage() {
    return this.productsService.findAllProducts();
  }

  
  @Get('/product_details')
  @Render('productDetails')
  productDetailPage(@Req() req, @Res() res){}

  @Get('product/edit/:id')
  // @Render('productDetails')
  findProduct(@Param('id') id: string) {
    console.log("inside get product");
    
    return this.productsService.findProduct(id);
  }

  @Get('product/:id')
  @Render('productDetails')
  async findClickedProduct(@Param('id') id: string, @Req() req, @Res() res) {
    console.log("inside get product by id");
    
    return await this.productsService.findProductById(id, req, res);
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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles(Role.ADMIN)
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


  
  // @Get('search_product')
  // async getSearchedR(@Query('search') search:string, @Param('skip') skip:number, @Param('take') take:number) {
  //   return this.productsService.paginationSortSearch(search, skip, take );
  // }

  @Get('search')
  async getSearchedResult(@Query('search') search:string, @Query('order') order:string) {
    return this.productsService.searchedProduct(search, order);
  }

  @Get('search-product')
  async Search(@Req() req, @Res() res) {
    console.log('user', req.query.data);

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

    const data= await this.productsService.pagination(req, res);
    res.send(data);
  }


  


}

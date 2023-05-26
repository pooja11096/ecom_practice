import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Req, Res, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post("upload")
@UseInterceptors(
FileInterceptor("image_url", {
storage: diskStorage({
destination: "./public",
filename(req, file, callback) {
callback(null, `${file.originalname}`);
},
}),
})
)
async uploadFile(@UploadedFile() file: any) {
console.log(file);

return "scucess";}

  @Post()
  @UseInterceptors(
    FileInterceptor("image_url", {
    storage: diskStorage({
    destination: "./uploads",
    filename(req, file, callback) {
    callback(null, `${file.originalname}`);
    },
    }),
    })
    )
  create(@UploadedFile() file: any,@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(file,createProductDto);
  }

  @Get('admin_product')
  @Render('admin_product')
  productData(@Req() req, @Res() res) {
    return this.productsService.findAllProducts(req,res);
  }

  @Get()
  @Render('user_productpage')
  findAll(@Req() req, @Res() res) {
    return this.productsService.findAllProducts(req,res);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Req() req, @Res() res) {
    return this.productsService.findProductById(id, req,res);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor("image_url", {
    storage: diskStorage({
    destination: "./uploads",
    filename(req, file, callback) {
    callback(null, `${file.originalname}`);
    },
    }),
    })
    )
  update(@UploadedFile() file: any,@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(file,id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}

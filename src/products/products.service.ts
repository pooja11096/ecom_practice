import { Injectable, UploadedFile } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Category } from 'src/categories/entities/category.entity';
import { fileURLToPath } from 'url';


// const FILE_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpeg',
//   'image/jpg': 'jpg'
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       const isValid = FILE_TYPE_MAP[file.mimetype];
//       let uploadError = new Error('invalid image type');

//       if(isValid) {
//           uploadError = null
//       }
//     cb(uploadError, 'public/uploads')
//   },
//   filename: function (req, file, cb) {
      
//     const fileName = file.originalname.split(' ').join('-');
//     const extension = FILE_TYPE_MAP[file.mimetype];
//     cb(null, `${fileName}-${Date.now()}.${extension}`)
//   }
// })

// const uploadOptions = multer({ storage: storage })


@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService){}


  async create(file: any,createProductDto: CreateProductDto) {

    try{
      const { product_name, product_description, product_price,category_name,image_url } = createProductDto;
      console.log("category_name",category_name);
      console.log("createProductDto",createProductDto);  
      
      return await this.prismaService.product.create({

        data: {
          product_name,
          product_description,
          product_price,
          image_url:file.path,
              categories: {
                create: [
                  { category_name: "category_name" },
                ],
              },
            },

            include:{
              categories: true,
              
            } 
       
   })
    }catch(err){
      throw err;
    }
  } 
  

  

  async findAllProducts(req: Request, res: Response) {
    try{
      const products =  await this.prismaService.product.findMany({
        include:{
          categories:true,
        }
       
      })
      console.log("products",products);
      
      return {products}
      
    }catch(err){
      throw err;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  async findProductById(id: string, req: Request, res: Response){
    try{
      const product= await this.prismaService.product.findUnique({where:{id}})
      return product;
    }catch(err){
      throw err;
    }
  }

  async updateProduct(file: any,id: string, updateProductDto: UpdateProductDto) {

    try{
      const {product_name,product_description,product_price } = updateProductDto;
      await this.prismaService.product.update({where:{id},
      data:{
        product_name,
        product_description,
        product_price,
        image_url:file.path

      }})
    }catch(err){
      throw err;
    }
  }

  async deleteProduct(id: string) {
    return await this.prismaService.product.delete({where:{id}})

  }
}

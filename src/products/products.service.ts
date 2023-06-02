import { Injectable, UploadedFile } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';

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
  constructor(private prismaService: PrismaService) {}

  async create(
    file: any,
    categoryId: string,
    createProductDto: CreateProductDto,
    req: Request,
    res: Response,
  ) {
    try {
      const { product_name, product_description, product_price } =
        createProductDto;

      // console.log("category_name",category_name);
      console.log('createProductDto', createProductDto);
      // const categories = await this.prismaService.category.findMany();
      // console.log("categories",categories);
      
      await this.prismaService.product.create({
        data: {   
          product_name,
          product_description,
          product_price,
          image_url:file,
          categories: {
            // set: categotyIds.map((categoryId)=>({id: categoryId}))
            connect: {
              id: categoryId,
            },
          },  
        },

        include: {
          categories: true,
        },
      });
      // return {categories}
      res.redirect('/products');
    } catch (err) {
      throw err;
    }
  }


  

  async createP(
    file: any,
    formData,
    req: Request,
    res: Response,
  ) {
    try {
      // const { product_name, product_description, product_price } =
      //   createProductDto;

      // console.log("category_name",category_name);
      // console.log('createProductDto', createProductDto);
      // const categories = await this.prismaService.category.findMany();
      // console.log("categories",categories);
      
      await this.prismaService.product.create({
        data: {   
          product_name: formData.product_name,
          product_description: formData.product_name,
          product_price: formData.product_price,
          image_url:file,
          categories: {
            // set: categotyIds.map((categoryId)=>({id: categoryId}))
            connect: {
              id: formData.categoryId,
            },
          },  
        },

        include: {
          categories: true,
        },
      });
      // return {categories}
      res.redirect('/products');
    } catch (err) {
      throw err;
    }
  }

  // async createProduct(
  //   createProductDto: CreateProductDto,
  //   req: Request,
  //   res: Response,
  // ) {
  //   try {
  //     // const category = await this.prismaService.category.findFirst
  //     await this.prismaService.product.create({
  //       data: {
  //         product_name: createProductDto.product_name,
  //         product_description: createProductDto.product_description,
  //         product_price: createProductDto.product_price,
  //         categories: {
  //           create: [
  //             {
  //               category_name: req.body.category_name,
  //             },
  //           ],
  //         },
  //       },
  //     });
  //     res.redirect('/products');
  //   } catch (err) {}
  // }

  async findAllProducts(req: Request, res: Response) {
    try {
      // const { draw, search, order } = req.query;

      const query = {
        where: {},
        include: { categories: true },
      };
      // const products =  await this.prismaService.product.findMany({
      //   include:{
      //     categories: true
      //   }

      // })

      const products = await this.prismaService.product.findMany(query);
      // console.log("products",products);

      // return res.json(
      // )
      return { products };

      // return res.json({
      //   draw:draw,
      //   data:products
      // })
    } catch (err) {
      throw err;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  async findProductById(id: string, req: Request, res: Response) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id }
        // include:
        // {
        //   categories:true
        // }
      });

      console.log("pro",product);
      
      return {product};
    } catch (err) {
      throw err;
    }
  }

  async updateDaata(id:string, updateProductDto:UpdateProductDto,req: Request, res: Response){
    try{
      const { product_name, product_description, product_price } =
        updateProductDto;

        await this.prismaService.product.update({where:{id},
        data:{
          product_name,
          product_description,
          product_price,
        }})
    }catch(err){
      throw err;
    }
  }

  async updateProduct(
    file: any,
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const { product_name, product_description, product_price } =
        updateProductDto;
      await this.prismaService.product.update({
        where: { id },
        data: {
          product_name,
          product_description,
          product_price,
          // image_url:file.path
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id: string) {
    return await this.prismaService.product.delete({ where: { id } });
  }
}

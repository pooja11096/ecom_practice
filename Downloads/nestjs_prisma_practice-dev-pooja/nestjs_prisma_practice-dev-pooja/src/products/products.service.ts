import { Injectable, UploadedFile } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';

// import multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Category } from 'src/categories/entities/category.entity';
import { fileURLToPath } from 'url';
import { Product } from '@prisma/client';

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

//   async createProduct(product_name: string, product_description: string, product_price: string, categoryIds: string[] = []) {
//     const categorydata = {
//       connect: categoryIds.map((id) => ({ id })),
//   };

//     // const category = categoryIds.map((id) => ({ id }))
   
//     // console.log("categories", categories)
//     try {
//         return this.prismaService.product.create({
//             data: {
//                 product_name,
//                 product_description,
//                 product_price,
//                 categorydata
//             },
//         });
//     }
//     catch (error) {
//         throw error; 
//     }

// }


async uploadSingleFile(file: any, product_name: string, product_description: string, product_price: string, categoryIds: string) {

  // console.log(categoryId, "categoryId")
  // const categories = {
  //     connect: categoryId.map((id) => ({ id })),
  // };
  // console.log("categories", categoryIds)
  // console.log("file", file.originalname)
  try {
      return await this.prismaService.product.create({
          data: {
              product_name: product_name,
              product_description: product_description,
              product_price: product_price,
              image_url:file.filename,
              // path: `http://localhost:3000/uploads/${file.filename}`,
              categories: {
                  connect: { id: categoryIds }
              }
          },
          include: { categories: true },
      });
  }
  catch (error) {
      throw new Error(error)
  }
}


async updateProducts(file:any,id: string, product_name: string, product_description: string, product_price: string, categoryIds: string) {
  // const categoryId: number[] = []
  // categoryId.push(Number(categoryIds))
  // console.log(categoryId, "categoryId")
  // const categories = {
  //     connect: categoryId.map((id) => ({ id })),
  // };
  console.log(categoryIds, "categoriesCDfcfdf")
  // console.log("file", file)
  try {
      return await this.prismaService.product.update({
          where: { id },
          data: {
            product_name,
            product_description,
            product_price,
            image_url: file.filename,
            categories: {
                connect: { id: categoryIds }
            }
          },
          include: { categories: true },
      });
  }
  catch (error) {
      throw new Error(error)
  }

}










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
      const categories = await this.prismaService.category.findMany();
      console.log('categories', categories);

      await this.prismaService.product.create({
        data: {
          product_name,
          product_description,
          product_price,
          image_url: file,

          categories: {
            // set: categotyIds.map((categoryId)=>({id: categoryId}))
            connect: {
              id: createProductDto.categoryId,
            },
          },
        },

        include: {
          categories: true,
        },
      });
      return { categories };
      // res.redirect('/products');
    } catch (err) {
      throw err;
    }
  }

  async createP(
    file: any,
    product_name: string,
    product_description: string,
    product_price: string,
    categoryId: string,
    req: Request,
    res: Response,
  ) {
    try {
      await this.prismaService.product.create({
        data: {
          product_name: product_name,
          product_description: product_description,
          product_price: product_price,
          image_url: file,
          categories: {
            connect: {
              id: categoryId,
            },
          },
        },
      });
      res.redirect('/products/');
    } catch (err) {
      throw err;
    }
  }

  async createProducts(
    file: any,
    createProductDto: CreateProductDto,
    categoryId: string,
    req: Request,
    res: Response,
  ) {
    // console.log('service create product', createproduct);

    // console.log(
    //   'split number',
    //   typeof createproduct.category.toString().split(','),
    // );
    //     console.log("createproduct",createproduct);

    //     let categoryObject = createproduct.categories.toString().split(',');
    //     console.log('category object', categoryObject);

    //     let result = Object.keys(categoryObject).map(
    // (key)=>({
    //       id: categoryObject[key],
    //     }));

    // console.log('result', result);

    //  const categoryId = createProductDto.categoryId;
    //  console.log("categoryId", categoryId);

    try {
      let dataProduct = await this.prismaService.product.create({
        data: {
          product_name: createProductDto.product_name,
          product_description: createProductDto.product_description,
          product_price: createProductDto.product_price,
          image_url: file,
          categories: {
            connect: {
              id: categoryId,
            },
          },
        },
      });

      console.log('data', dataProduct);
      // return dataProduct;
      res.redirect('/products');
    } catch (error) {
      console.log(error);
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

  async findAllProducts() {
    try {
      // const { draw, search, order } = req.query;

      const query = {
        include: { categories: true },
      };
      // const products =  await this.prismaService.product.findMany({
      //   include:{
      //     categories: true
      //   }

      // })

      return await this.prismaService.product.findMany(query);

      // console.log("products",products);

      // return res.json(
      // )
      // return { products };

      // return res.json({
      //   draw:draw,
      //   data:products
      // })
    } catch (err) {
      throw err;
    }
  }


  async usersAllProducts(req: Request, res: Response){
    try{
      const products =  await this.prismaService.product.findMany({
        include:{
          categories:true
        }
      })
      console.log("pwithc", products[0].categories[0].category_name);
      
      return {products}
    }catch(err){
      throw err;
    }
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} product`;
  // }

  async findProductById(id: string, req: Request, res: Response) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          categories: true,
        },
      });

      console.log('pro', product);

      return { product };
    } catch (err) {
      throw err;
    }
  }

  async findProduct(id: string) {
    try {
     return await this.prismaService.product.findUnique({
        where: { id },
        include: {
          categories: true,
        },
      });

      // console.log('pro', product);

      // return { product };
    } catch (err) {
      throw err;
    }
  }

  async updateDaata(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    res: Response,
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
        },
      });
    } catch (err) {
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

  async searchedProduct(query: string, order: string) {
    try {
      return await this.prismaService.product.findMany({
        include: { categories: true },
        take:2,
        skip:1,
        where: {
          OR: [
            {
              product_name: {
                startsWith: query,
              },
            },
            {
              product_description: {
                startsWith: query,
              },
            },
            {
              product_price: {
                startsWith: query,
              },
            },
          ],
        },
        orderBy: [
          {
            product_name: 'desc',
          },
        ],
      });
    } catch (err) {
      throw err;
    }
  }

  async paginationSortSearch(
    searchQ: string,
    params: { skip?: number; take?: number },
  ) {
    const { skip, take } = params;

    if (isNaN(skip)) {
      return this.prismaService.product.findMany({
        take,
      });
    } else {
      return this.prismaService.product.findMany({
        skip,
        take,
        where: {
          product_name: {
            contains: searchQ,
          },
        },
        orderBy: {
          product_name: 'desc',
        },
      });
    }
  }

  async productByCategory(category_name:string,res: Response, req: Request){
    try{
      const products = await this.prismaService.product.findMany({
     
        where:{
          categories:{ 
            some:{
              category_name:{
                contains: category_name
              }
            }
          }
          // categories:[{
          //   where:{id: categoryId}
          // }]
        },
        include:{
          categories:true
        }
        
      })
      console.log("pbyc",products);
      // console.log(products[2].categories);
      
      
      res.render('shop',{products})
      // res.redirect('/products/user_product')
      // return {products}
    }catch(err){
      throw err;
    }
  }

  // async searchedProduct(query: Query): Promise<Product[]> {
  //   const resPerPage = 2;
  //   const currentPage = Number(query.page) || 1;
  //   const skip = resPerPage * (currentPage - 1);

  //   const keyword = query.keyword
  //     ? {
  //         product_name: {
  //           $regex: query.keyword,
  //           $options: 'i',
  //         },
  //       }
  //     : {};

  // }

  // async searchedProduct()



  async search(req, res) {
    try {
      const page =  req.page||1;
      const perPage =  2;
  
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const search = await this.prismaService.product.findMany({
        skip: skip,
        take: perPage,
        include:{categories:true},
        where: {

          
              OR: [
                {
                  product_name: {
                    startsWith: req.data,
                  },
                },
               
                {
                  product_description: {
                    startsWith: req.data,
                  },
                },
              ],
            
        },
       
      });
      console.log("searched d",search);
      return search;
    } catch (error) {
      throw error;
    }
  }

  async sort(req, res) {
    try{

      const page =  req.page||1;
      const perPage =  2;
  
      const skip = page > 0 ? perPage * (page - 1) : 0;
      if(req.data=='product_name'){
      const sort = await this.prismaService.product.findMany({
        skip: skip,
        take: perPage,
        orderBy:{
          product_name: req.type,
        },
        include:{categories:true},
        
      })
      return sort;
    }else if(req.data=='product_price'){
      
      const sort = await this.prismaService.product.findMany({
        skip: skip,
        take: perPage,
        orderBy:{
          product_price: req.type,
        },
        include:{categories:true},
        
      })
      return sort;
    }
     
    }catch(error) {
      throw error;
    }
  }

  async pagination(req, res) {
    try {
      
      const page =  req.query.page||1;
      const perPage =  2;
  
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const product = await this.prismaService.product.findMany({
        skip: skip,
        take: perPage,
        include:{categories:true},
        
      });
    
      return product;
    } catch (error) {
      throw error;
    }
}
}




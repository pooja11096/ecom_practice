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

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async uploadSingleFile(
    file: any,
    product_name: string,
    product_description: string,
    product_price: number,
    categoryIds: string,
  ) {
    try {
      // categoriesId

      return await this.prismaService.product.create({
        data: {
          product_name: product_name,
          product_description: product_description,
          product_price: +product_price,
          image_url: file.filename,
          categories: {
            // create:{
            //   // connect: {},

            // }
            connect: { id: categoryIds },
          },
        },
        include: { categories: true },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProducts(
    // file: any,
    id: string,
    product_name: string,
    product_description: string,
    product_price: number,
    categoryIds: string,
  ) {
    console.log('fjdkhglfkh<<<<<<<<<<', categoryIds, 'categoriesCDfcfdf');
    try {
      return await this.prismaService.product.update({
        where: { id },
        data: {
          product_name,
          product_description,
          product_price,
          // image_url: file.filename,
          categories: {
            connect: { id: categoryIds },
          },
        },
        include: { categories: true },
      });
    } catch (error) {
      throw new Error(error);
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
    try {
      let dataProduct = await this.prismaService.product.create({
        data: {
          product_name: createProductDto.product_name,
          product_description: createProductDto.product_description,
          product_price: createProductDto.product_price,
          image_url: file,
          categories: {
            // connect: {},
            connect: {
              id: categoryId,
            },
          },
        },
      });

      console.log('data', dataProduct);
      res.redirect('/products');
    } catch (error) {
      console.log(error);
    }
  }
  async findAllProductsAdmin() {
    return await this.prismaService.product.findMany({
      take: 4,
      include: {
        categories: true,
      },
    });
  }

  async findAllProducts(req, res: Response) {
    try {
      const total = await this.prismaService.product.count();

      const page = req.query.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const query = {
        take: perPage,
        skip: skip,
        include: { categories: true },
      };
      const lastPage = Math.ceil(total / perPage);
      console.log(' dfjlkh', lastPage);

      const products = await this.prismaService.product.findMany(query);
      return { products, lastPage };
      // res.render('create_product', { products, lastPage });
    } catch (err) {
      throw err;
    }
  }

  async usersAllProducts(req, res: Response) {
    try {
      const total = await this.prismaService.product.count();

      const page = req.query.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const query = {
        take: perPage,
        skip: skip,
        include: { categories: true },
      };
      const lastPage = Math.ceil(total / perPage);

      console.log('lastpage', lastPage);

      const products = await this.prismaService.product.findMany(query);
      console.log('pwithc', products[0].categories[0].category_name);

      return { products, lastPage };
    } catch (err) {
      throw err;
    }
  }

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
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id: string) {
    return await this.prismaService.product.delete({
      where: { id },
      include: {
        categories: true,
      },
    });
  }

  async deleteP(id: string) {
    return await this.prismaService.product.delete({
      where: {
        id: id,
      },
    });
  }

  async productByCategory(category_name: string, res: Response, req) {
    try {
      const total = await this.prismaService.product.count();

      const page = req.query.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const query = {
        take: perPage,
        skip: skip,
        include: { categories: true },
      };
      const lastPage = Math.ceil(total / perPage);

      console.log('lastpage', lastPage);

      const products = await this.prismaService.product.findMany({
        where: {
          categories: {
            some: {
              category_name: {
                contains: category_name,
              },
            },
          },
        },
        include: {
          categories: true,
        },
      });
      console.log('pbyc', products);

      res.render('shop', { products, lastPage });
    } catch (err) {
      throw err;
    }
  }

  async search(req, res) {
    try {
      const page = req.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const search = await this.prismaService.product.findMany({
        // select: {},
        skip: skip,
        take: perPage,
        // include: { categories:{where:{
        //   OR:[{
        //     category_name: {startsWith: req.data}
        //   }]
        // }} },
        // include:{
        //   categories:{
        //     select:{
        //       category_name: true
        //     },
        //     where:{
        //       OR:[{
        //         category_name:{
        //           startsWith: req.data
        //         }
        //       }]
        //     }
        //   }
        // },
        include: {
          categories: true,
        },
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
      console.log('searched d', search);
      return search;
    } catch (error) {
      throw error;
    }
  }

  async sort(req, res) {
    try {
      const page = req.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      if (req.data == 'product_name') {
        const sort = await this.prismaService.product.findMany({
          skip: skip,
          take: perPage,

          orderBy: {
            product_name: req.type,
          },
          include: { categories: true },
        });
        console.log('sortt', sort);

        return sort;
      } else if (req.data == 'product_description') {
        const sort = await this.prismaService.product.findMany({
          skip: skip,
          take: perPage,
          orderBy: {
            product_description: req.type,
          },
          include: { categories: true },
        });
        return sort;
      } else if (req.data == 'product_price') {
        const sort = await this.prismaService.product.findMany({
          skip: skip,
          take: perPage,
          orderBy: {
            product_price: req.type,
          },
          include: { categories: true },
        });
        return sort;
      }
    } catch (error) {
      throw error;
    }
  }

  async pagination(req, res) {
    try {
      const page = req.query.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const product = await this.prismaService.product.findMany({
        skip: skip,
        take: perPage,
        include: { categories: true },
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  async proWithCat() {
    return await this.prismaService.product.findMany({
      include: { categories: true },
    });
  }

  async updateProWithCat(
    productId: string,
    categoryId: string,
    product_name: string,
    product_description: string,
    product_price: number,
  ) {
    try {
      await this.prismaService.product.update({
        where: { id: productId },
        data: {
          categories: {
            set: [],
          },
        },
      });

      return await this.prismaService.product.update({
        where: { id: productId },
        data: {
          product_name,
          product_description,
          product_price,
          categories: { connect: { id: categoryId } },
        },
      });
    } catch (err) {
      throw err;
    }
  }
}

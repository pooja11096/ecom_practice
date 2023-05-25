import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService){}

  // async createUser(createUserDto: CreateUserDto, req: Request,res: Response) {
  //   try {
  //     const { name, email, password, roleId } = createUserDto;
  //     console.log("type", typeof roleId);

  //     // const role = Integer.parseInt(roleId);
      

  //     const findUser = await this.prismaService.user.findUnique({ where: { email } })

  //     if (findUser) {
  //       throw new BadRequestException('Email already exists');
  //     }

  //     const hashedPassword = await this.hashPassword(password);
  //     // const roleId = JSON.stringify(roleId);
  //     const users = await this.prismaService.user.create({
  //       data: {
  //         name,
  //         email,
  //         hashedPassword, 
  //         roleId:+roleId  
  //       }
  //     })

  //     // return this.prismaService.user.create(createAuthDto)
  //     // return "signup"
      
  //     res.redirect('/users')
  //   } catch (err) {
  //     throw err
  //   }
  //   // return 'This action adds a new user';
  // }

  async create(createProductDto: CreateProductDto) {

    try{
      const { product_name, product_description, product_price, category_name } = createProductDto;
      console.log("category_name",category_name);
      console.log("createProductDto",createProductDto);  
      
      
      return await this.prismaService.product.create({
      

        // data: {
        //   product_name: 'product1',
        //   product_description:'sgdfg',
        //   product_price: 500,
        //       categories: {
        //         create: [
        //           { category_name: 'cname1' },
        //           { category_name: 'cname2' },
        //         ],
        //       },
        //     },

        //     include:{
        //       categories: true
        //     }

        data: {
          product_name,
          product_description,
          product_price,
              categories: {
                create: [
                  { category_name: category_name },
                ],
              },
            },

            include:{
              categories: true
            }
       
   })
      // return "created successfully"
    }catch(err){
      throw err;
    }
    // return 'This action adds a new product';
  }   

  async findAll() {
    try{
      return await this.prismaService.product.findMany({
        include:{
          categories:true
        }
       
      })
      
    }catch(err){
      throw err;
    }
    // return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async deleteProduct(id: string) {
    return await this.prismaService.product.delete({where:{id}})

    // return this.prismaService.product.delete({id})
    // return `This action removes a #${id} product`;
  }
}

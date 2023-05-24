import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService){}

  async create(createProductDto: CreateProductDto) {

    try{
      const { name, description, price } = createProductDto;

      return await this.prismaService.product.create({data:{
        name,
        description,
        price,
        categories: {
          create:[
            {
              category:{
                create:{
                  name
                
                }
              }
            },
          
          ],
          
        }

      },
    include:{
      categories:true
    }})
      // return "created successfully"
    }catch(err){
      throw err;
    }
    // return 'This action adds a new product';
  }

  async findAll() {
    try{
      return await this.prismaService.product.findMany({
       
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

  async remove(id: string) {
    return await this.prismaService.user.delete({where:{id}})

    // return this.prismaService.product.delete({id})
    // return `This action removes a #${id} product`;
  }
}

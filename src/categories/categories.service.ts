import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import  {Request, Response} from 'express';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService){}
  
  async create(createCategoryDto: CreateCategoryDto,req: Request, res: Response) {

    await this.prismaService.category.create({data:createCategoryDto})
    res.redirect('/categories')
  }


  async findAllCategory(req: Request, res: Response ) {
    const categories = await this.prismaService.category.findMany({
      // include:{
      //   products: true
      // }
    });
    console.log("categories",categories);
    return {categories}
    
  }

 async  findOne(id: string) {
  return this.prismaService.category.findUnique({where:{id}})
    // return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto,req: Request, res: Response) {
    const {category_name} = updateCategoryDto;
    return this.prismaService.category.update({
      where:{id},
      data:{
        category_name
      }
    })
    // return `This action updates a #${id} category`;
  }

  async remove(id: string) {
    await this.prismaService.category.delete({where:{id}})
    return `This action removes a #${id} category`;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService){}
  
  async create(createCategoryDto: CreateCategoryDto) {

    return this.prismaService.category.create({data:createCategoryDto})
    // return 'This action adds a new category';
  }

  // const users = await this.prismaService.user.findMany({
  //   include: {role:true}
  //  })
  //  console.log("users",users);
   
  //  return {users}


  async findAllCategory(req: Request, res: Response ) {
    const categories = await this.prismaService.category.findMany({
      include:{
        products: true
      }
    });
    console.log("categories",categories);
    return {categories}
    
    // return `This action returns all categories`;
  }

 async  findOne(id: string) {
  return this.prismaService.category.findUnique({where:{id}})
    // return `This action returns a #${id} category`;
  }

  // async update(id: string, updateUserDto: UpdateUserDto, req: Request, res: Response) {
  //   // return `This action updates a #${id} user`;
  //   const { name, email, roleId } = updateUserDto;
  //   // const hashedPassword = await this.hashPassword(password);
  //   console.log(updateUserDto);
    
  //    await this.prismaService.user.update({
  //     where:{id},
  //     data:{ 
  //     name,
  //     email,
  //     roleId:+roleId
      
  //   }
  // });

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

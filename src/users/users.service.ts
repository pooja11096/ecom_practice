import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';



@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService){}
  
  async createUser(createUserDto: CreateUserDto, req: Request,res: Response) {
    try {
      const { name, email, password, roleId } = createUserDto;
      console.log("type", typeof roleId);

      // const role = Integer.parseInt(roleId);
      

      const findUser = await this.prismaService.user.findUnique({ where: { email } })

      if (findUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      // const roleId = JSON.stringify(roleId);
      const users = await this.prismaService.user.create({
        data: {
          name,
          email,
          hashedPassword, 
          roleId:+roleId  
        }
      })

      // return this.prismaService.user.create(createAuthDto)
      // return "signup"
      
      res.redirect('/users/user')
    } catch (err) {
      throw err
    }
    // return 'This action adds a new user';
  }

  async getAllUsers(req: Request, res: Response) {

    const { draw, search, order } = req.query;

    // const offset = req.query.start || 0;
    // const limit = req.query.length || 10;

    const columns = ["id", "name", "email"];

    // const { dir, column } = order[0];

    // const columnOrder = columns[column];
    // const orderDirection = dir.toUpperCase();

    // if (column == 3) {
    //   var orderBy = [[role, "name", orderDirection]];
    // }else {
    //   var orderBy = [[columnOrder, orderDirection]];
    // }

    const query = {
      where: {    
      },
      include:{role:true}
    
     

      // select: {
      //   id: true,
      //   name: true,
      //   email: true,
      // },
      // offset: +offset,
      // limit: +limit,
      // order: [[columnOrder, orderDirection]],
    };
    // include: {role:true}

    
      const users = await this.prismaService.user.findMany(query)
      //  console.log("users",users);
      
       return {users}
      return res.json({
        // draw:draw,
        data:users
      })

       
    
   
  }

  async getUsers( req: Request, res: Response){

    try{
      const users  = await this.prismaService.user.findMany({include: {role:true}});

      return res.json({data:users})
      // return {users}

    }catch(err){
      throw err;
    }
    // return await this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({where:{id},include:{
      role:true
    }})
    // return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: Request, res: Response) {
    // return `This action updates a #${id} user`;
    const { name, email, roleId } = updateUserDto;
    // const hashedPassword = await this.hashPassword(password);
    console.log(updateUserDto);
    
     await this.prismaService.user.update({
      where:{id:id},
      data:{ 
      name,
      email,
      roleId:+roleId
      
    }
  });

  // res.redirect('/users/user')
  //  return req.user.id; 
    // return "update"

    // return this.prismaService.user.update()
  }

  async deleteUser(id: string) {
    return await this.prismaService.user.delete({where:{id}})
    // return `This action removes a #${id} user`;
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  
  
  }
}



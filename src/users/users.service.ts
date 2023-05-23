import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService){}
  
  async createUser(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, roleId } = createUserDto;

      const findUser = await this.prismaService.user.findUnique({ where: { email } })

      if (findUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      await this.prismaService.user.create({
        data: {
          name,
          email,
          hashedPassword, 
          roleId
          // role: { connect: {id:roleId}}
        }
      })
      // return this.prismaService.user.create(createAuthDto)
      return "signup"
    } catch (err) {
      throw err
    }
    // return 'This action adds a new user';
  }

  async getAllUsers(req: Request, res: Response) {
   const users = await this.prismaService.user.findMany({
    include: {role:true}
   })
   console.log(users);
   
   return {users}
  }

  async getUsers(){
    return await this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({where:{id}})
    // return `This action returns a #${id} user`;
  }

  async update(id: string, createUserDto: CreateUserDto) {
    // return `This action updates a #${id} user`;
    const { name, email, password, roleId } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    console.log(createUserDto);
    
    return await this.prismaService.user.update({
      where:{id},
      data:{ 
      name,
      email,
      hashedPassword, 
      roleId
      
    }
  }); 
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



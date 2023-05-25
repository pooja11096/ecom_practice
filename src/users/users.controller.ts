import { Controller, Get, Post, Body, Patch,Put, Param, Delete, UseGuards, Render,Req, Res ,Response} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
const prisma = new PrismaClient();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post()
  createUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    return this.usersService.createUser(createUserDto, req, res);
  }

  @Get('/home')
  @Render('home')


  @Get()
  @Render('admin')
  findAll(@Req() req, @Res() res) {
    return this.usersService.getAllUsers(req, res);
  }

  // @Get('user')
  // getAll(){
  //   return this.usersService.getUsers();
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  // @Render('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req: any, @Res() res) {
    return this.usersService.update(id, updateUserDto, req, res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUserId (@Req() req: any){
    return req.user.id;
  }

  @Get('user/:id')
    async getUser(@Param('id') id: string,@Response() res){
      
        const user = await  prisma.user.findUnique({
            where: { id: id },
          });
          return res.json(user);
    }


  
}

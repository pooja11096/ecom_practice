import { Controller, Get, Post, Body, Patch,Put, Param, Delete, UseGuards, Render,Req, Res ,Response} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/entities/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { CategoriesService } from 'src/categories/categories.service';
const prisma = new PrismaClient();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private readonly categoriesService: CategoriesService) {}

  @Get('user_home')
  @Render('users_panel')
  getUserPanel(@Req() req, @Res() res){
    return this.categoriesService.findAllCategory(req, res);
  
  }

  @Get('add_user_page')
  @Render('add_users')
  addUserPage(){}

  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    return this.usersService.createUser(createUserDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin_dashboard')
  @Roles(Role.ADMIN)
  @Render('dashboard')
  renderHome(){
    
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/')
  // @Roles(Role.ADMIN)
  // @Render('manage_users')
  // async getManageUser() {
    
  // }


  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @Roles(Role.ADMIN)
  @Render('users_crud')
  getAllUsers(@Req() req, @Res() res) {
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
  @Roles(Role.ADMIN)
  // @Render('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req: any, @Res() res) {
    return this.usersService.update(id, updateUserDto, req, res);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
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

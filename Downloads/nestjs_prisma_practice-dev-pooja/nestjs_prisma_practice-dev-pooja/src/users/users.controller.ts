import { Controller, Get, Post, Body, Patch,Put, Param, Delete, UseGuards, Render,Req, Res ,Response, Query} from '@nestjs/common';
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

  // @Get('search')
  // async backend(@Req() req: Request, @Query('query') query: string) {
  //     let options = {};

  //     if (query) {
  //         options = {
  //             $or: [
  //                 {title: new RegExp(query.toString(), 'i')},
  //                 {description: new RegExp(req.query.s.toString(), 'i')},
  //             ]
  //         }
  //     }

  //     const query = this.prisma.user.findMany(options);

  //     if (req.query.sort) {
  //         query.sort({
  //             price: req.query.sort
  //         })
  //     }

  //     const page: number = parseInt(req.query.page as any) || 1;
  //     const limit = 9;
  //     const total = await this.productService.count(options);

  //     const data = await query.skip((page - 1) * limit).limit(limit).exec();

  //     return {
  //         data,
  //         total,
  //         page,
  //         last_page: Math.ceil(total / limit)
  //     };
  // }

  // @Get('product')


  @Get('search')
  searchD(@Query('search') search: string){
    return this.usersService.searchUser(search);
  }


  @Get('user_home')
  @Render('users_panel')
  getUserPanel(@Req() req, @Res() res){
    return this.categoriesService.findAllCategory(req, res);
  
  }

  @UseGuards(JwtAuthGuard)
  @Get('add_user_page')
  @Roles(Role.ADMIN)
  @Render('add_users')
  addUserPage(){
    
  }

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


  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @Roles(Role.ADMIN)
  @Render('users_crud')
  getAllUsers(@Req() req, @Res() res) {
    return this.usersService.getAllUsers(req, res);
    
  }
  

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

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getUserId (@Req() req: any){
  //   return req.user.id;
  // }

  @Get('user/:id')
    async getUser(@Param('id') id: string,@Response() res){
      
        const user = await  prisma.user.findUnique({
            where: { id: id },
          });
          return res.json(user);
    }


  
}

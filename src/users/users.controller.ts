import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  Render,
  Req,
  Res,
  Response,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/entities/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';
import { Permissions } from 'src/auth/entities/permissions.decorator';
import { Permission } from 'src/auth/entities/permissions.enum';
import { CategoriesService } from 'src/categories/categories.service';
const prisma = new PrismaClient();

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  // @Get('search')
  // searchD(@Query('search') search: string) {
  //   return this.usersService.searchUser(search);
  // }

  @Get('user_home')
  @Roles(Role.USER)
  @Render('users_panel')
  getUserPanel(@Req() req, @Res() res) {
    return this.categoriesService.getAllCategory(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('add_user_page')
  @Roles(Role.ADMIN)
  @Render('add_users')
  addUserPage() {}

  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    return this.usersService.createUser(createUserDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin_dashboard')
  @Roles(Role.ADMIN)
  @Permissions(Permission.READ)
  @Render('dashboard')
  renderHome() {}

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @Roles(Role.ADMIN)
  @Permissions(Permission.MANAGE_USER)
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
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res,
  ) {
    return this.usersService.update(id, updateUserDto, req, res);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  // @Get('user/:id')
  // async getUser(@Param('id') id: string, @Response() res) {
  //   console.log('id', id);

  //   const user = await prisma.user.findUnique({
  //     where: { id: id },
  //   });
  //   return res.json(user);
  // }

  @Get('user/:id')
  // @Permissions(Permission.CREATE)
  getUserForEdit(@Param('id') id: string, @Response() res) {
    return this.usersService.findUser(id, res);
  }

  // @Get('search')
  // async Search(@Req() req, @Res() res) {
  //   console.log('user', req.query.data);

  //   const data = await this.usersService.search(req.query, res);

  //   res.send(data);
  // }

  @Post('sort-user')
  async Sort(@Req() req, @Res() res, @Req() reqq: any) {
    console.log('user', req.query.data);

    const data = await this.usersService.sort(req.query, res, reqq);

    res.send(data);
  }

  @Post('/page')
  async Pagination(@Req() req, @Res() res) {
    // console.log('findAll');

    const data = await this.usersService.pagination(req, res);
    res.send(data);
  }
}

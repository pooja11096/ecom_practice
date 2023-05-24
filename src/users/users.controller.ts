import { Controller, Get, Post, Body, Patch,Put, Param, Delete, UseGuards, Render,Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post()
  createUser(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res) {
    return this.usersService.createUser(createUserDto, req, res);
  }

  // @Get()
  // @Render('admin')
  // findAll(@Req() req, @Res() res) {
  //   return this.usersService.getAllUsers(req, res);
  // }

  @Get('user')
  getAll(){
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  // @Render('admin')
  update(@Param('id') id: string, @Body() createUserDto: CreateUserDto,@Req() req: any) {
    return this.usersService.update(id, createUserDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUserId (@Req() req: any){
    return req.user.id;
  }
}

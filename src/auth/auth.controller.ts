import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { json } from 'stream/consumers';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  // async googleAuth(@Request() req){}


  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res){
    return this.authService.googleAuth( req, res);
  }

  @Get('/signup')
  @Render('register')
  RegisterPage(){
    return {message:'page rendered'};
  }
  
  @Get('/signin')
  @Render('login')
  LoginPage(){
    return {message:'login page rendered'};
  }

  
  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto, @Req() req, @Res() res){
    return this.authService.signup(createAuthDto, req, res)
  }

  @Post('signin')
  signin(@Body() createAuthDto: Record<string, any>, @Req() req, @Res() res){
    return this.authService.signin(createAuthDto.email, createAuthDto.password, req, res)
  }

  @Get('signout')
  signout(@Req() req, @Res() res){
    return this.authService.signout(req, res)
  }
  
  // @AuthGuard('jwt')
  
  @UseGuards(JwtAuthGuard)
  @Render('admin')
  @Post('profile')
  getUserId (@Req() req: any){
    const user = req.user.id;
    return user;
  }

  @Get('alluser')
  @UseGuards(JwtAuthGuard)
  @Render('admin')
  findAll(@Req() req:any, @Res() res) {
    console.log("token",req.user);
    
    return this.authService.getAllUsers(req, res);
  }

  
}
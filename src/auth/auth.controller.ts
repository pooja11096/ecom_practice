import { Controller,UseGuards, Get, Post, Body, Patch, Param, Delete,Request,Req, Res, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req){}


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
  signup(@Body() createAuthDto: CreateAuthDto){
    return this.authService.signup(createAuthDto)
  }

  @Post('signin')
  signin(@Body() createAuthDto: Record<string, any>, @Req() req, @Res() res){
    return this.authService.signin(createAuthDto.email, createAuthDto.password, req, res)
  }

  @Get('signout')
  signout(@Req() req, @Res() res){
    return this.authService.signout(req, res)

  }
  
}

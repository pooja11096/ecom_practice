import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { json } from 'stream/consumers';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { PrismaService } from 'prisma/prisma.service';


// // import { Body,Controller,Get, Post, Render, Request, Response, UseGuards} from '@nestjs/common';
// import { AuthService } from './auth.service';
// import {AuthDto} from './dto/auth.dto';
// import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Get('forget_pwd')
  @Render('forget_pwd')
  forgetPwdPage(){}

  // @Public()
  @Get('forgot-password')
  getForgotPassword(@Req() req, @Res() res) {
    res.render('forgot-password');
  }

  // @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.forgotPassword(email)
    console.log("user",user)
    return res.redirect('/auth/otp');
  }

  // @Public()
  @Get('otp')
  getOtp(@Req() req, @Res() res) {
    res.render('otp');
  }

  // @Public()
  @Post('otp')
  async verifyOtp(@Body('otp') otp: string, @Req() req, @Res() res, @Body('password') password: string): Promise<any> {
    const user = await this.authService.verifyOtp(otp, password)
    return res.send('verify sent succesfully');

  }

  // @Public()
  @Post('reset-password')
    async resetPassword(@Body('password') password: string, @Body('otp') otp: string, @Req() req, @Res() res) {
      const user = await this.authService.resetPassword(password, otp)
    return res.send('Password reset successfully');
    }



  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req){}


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

  // @Get('email')
  // forgotPass(@Body() createAuthDto: Record<string, any>){
  //   return this.authService.sendEmailForgotPassword(createAuthDto.email);
  // }

  // @Get("email/forgot-passeord/:email")
  // public async sendEmailForgotPassword(@Params() params){
  //   try{

  //     var emailSent = await this.authService.sendEmailForgotPassword(params.email);

  //     if(emailSent){
  //     throw new ResponseSuccess("LOGIN.USER_NOT_FOUND", HttpStatus.NOT_FOUND);

  //     }else{
  //     throw new ResponseError("REGISTRATION.EMAIL.MAIL_NOT_SENT");
  //     }
  //   }catch(err){
  //     throw err;
  //   }
  // }

  
}

// function Public(): (target: AuthController, propertyKey: "resetPassword", descriptor: TypedPropertyDescriptor<(password: string, otp: string, req: any, res: any) => Promise<any>>) => void | TypedPropertyDescriptor<...> {
//   throw new Error('Function not implemented.');
// }










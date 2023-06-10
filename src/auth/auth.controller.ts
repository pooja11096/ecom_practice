import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { json } from 'stream/consumers';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('forget_pwd')
  @Render('forgot_pwd')
  forgetPwdPage() {}

  @Get('forgot-password')
  getForgotPassword(@Req() req, @Res() res) {
    res.render('forgot-password');
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    const user = await this.authService.forgotPassword(email);
    return res.redirect('/auth/otp');
  }

  @Get('otp')
  getOtp(@Req() req, @Res() res) {
    res.render('otp');
  }

  @Post('otp')
  async verifyOtp(
    @Body('otp') otp: string,
    @Req() req,
    @Res() res,
    @Body('password') password: string,
  ): Promise<any> {
    const user = await this.authService.verifyOtp(otp, password);
    return res.send('verify sent succesfully');
  }

  @Post('reset-password')
  async resetPassword(
    @Body('password') password: string,
    @Body('otp') otp: string,
    @Req() req,
    @Res() res,
  ) {
    const user = await this.authService.resetPassword(password, otp);
    return res.send('Password reset successfully');
  }

  @Get()
 
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleAuth(req, res);
  }

  @Get('/signup')
  @Render('register')
  RegisterPage() {
    return { message: 'page rendered' };
  }

  @Get('/signin')
  @Render('login')
  LoginPage() {
    return { message: 'login page rendered' };
  }

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto, @Req() req, @Res() res) {
    return this.authService.signup(createAuthDto, req, res);
  }

  @Post('signin')
  signin(@Body() createAuthDto: Record<string, any>, @Req() req, @Res() res) {
    return this.authService.signin(
      createAuthDto.email,
      createAuthDto.password,
      req,
      res,
    );
  }

  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Render('admin')
  @Post('profile')
  getUserId(@Req() req: any) {
    const user = req.user.id;
    return user;
  }

  // @Get('alluser')
  // @UseGuards(JwtAuthGuard)
  // @Render('admin')
  // findAll(@Req() req: any, @Res() res) {

  //   return this.authService.getAllUsers(req, res);
  // }

  @Get('search')
  async Search(@Req() req, @Res() res) {
    const data = await this.authService.search(req.query, res);
    res.send(data);
  }

  @Get('/usertoken')
  userFromToken(@Req() req, @Res() res) {
    return this.authService.getUserFromToken(req, res);
  }
}

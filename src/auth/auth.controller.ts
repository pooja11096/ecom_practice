import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

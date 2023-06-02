import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
// import { PrismaService } from 'prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
// import { CreateAuthDto } from './dto/create-auth.dto.ts';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { jwtSecret } from 'src/utils/constants';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as argon from 'argon2';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}


  
  async signup(createAuthDto: CreateAuthDto, req: Request, res: Response) {
    try {
      const { name, email, password, roleId } = createAuthDto;

      const findUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (findUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      await this.prismaService.user.create({
        data: {
          name,
          email,
          hashedPassword,
          roleId,
        },
      });
      // return this.prismaService.user.create(createAuthDto)
      //   return "signup"
      res.redirect('/auth/signin');
    } catch (err) {
      throw err;
    }
  }

  async signin(email: string, password: string, req: Request, res: Response) {
    try {
      const findUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      // console.log("finaduser", findUser);

      if (!findUser) {
        throw new BadRequestException('Wrong Credentials');
      }

      const isMatch = await this.comparePasswords({
        password,
        hash: findUser.hashedPassword,
      });

      if (!isMatch) {
        throw new BadRequestException('Wrong Credentials');
      }

      const token = await this.signToken({
        id: findUser.id,
        email: findUser.email,
        roleId: findUser.roleId,
      });

      if (!token) {
        throw new ForbiddenException();
      }
      const decodet = this.jwtService.decode(token);
      // console.log("dcode", decodet);
      // console.log(typeof decodet);
      // console.log(decodet);

      // console.log(decodet.id);
      res.cookie('token', token, {});

      if (findUser.roleId == 2) {
        res.redirect('/users/admin_dashboard');
      } else {
        res.redirect('/users/user_home');
      }

      return res.send({ message: 'Logged in successfull' });
    } catch (err) {
      throw err;
    }
  }

  async signout(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      return res.send({ message: 'Logout successful' });
      // return "LogOut";
    } catch (err) {
      throw err;
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string; roleId: number }) {
    const payload = args;
    // console.log("iddd",payload.id);

    // console.log(this.jwtService.signAsync(payload, { secret: jwtSecret }));

    return this.jwtService.signAsync(payload, { secret: jwtSecret });
  }

  async googleAuth(req, res) {
    if (!req.user) {
      return 'no user from google';
    }

    // const {email, password} = dto;
    // const findUser = await this.prisma.user.findUnique({
    //     where:{email}
    // })
    // return{
    //     message: "user info from google"
    // }
    // if(findUser.roles === 'User'){
    //     res.render('user')
    // }else{
    //     res.render('admin')
    // }
    // console.log("user",req.user);

    res.render('users_panel');
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.prismaService.user.findMany({
      include: { role: true },
    });
    // console.log("sers",users);

    return { users };
  }


  async forgotPassword(email: string,){
    console.log(email)
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email
      }
    });
    if (!user) {
      return 'User not found';
    }
    //   //four digit otp
    const otp = Math.floor(1000 + Math.random() * 9000);
    await this.prismaService.user.update({
      where: {
        email: email
      },
      data: {
        otp: otp
      }
    })
    console.log("otp", otp);
    const mail = await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'rajni901@gmail.com',// sender address
      subject: 'Forgot Password', // Subject line
      text: 'Forgot Password', // plaintext body
      html: `<b>Forgot Password</b>
            <p>OTP: ${otp}</p>`, // HTML body content
    })
    console.log("mail", mail);
    return mail;
    // return res.redirect('/auth/otp');
  }

  async verifyOtp(otp:string ,password: string) {
      console.log("otp", otp);
    const user = await this.prismaService.user.findFirst({
      where: {
        otp: +otp
      }
    });
    if (!user) {
      return 'Incorrect otp';
    }
    return 'Correct otp';
  }

  async resetPassword(password: string, otp:string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        otp: +otp
      }
    });
    if (!user) {
      return 'Incorrect otp';
    }
    const passwordHash = await argon.hash(password);
    await this.prismaService.user.update({
      where: {
        email: user.email
      },
      data: {
        hashedPassword: passwordHash,
      }
    })
    return 'Password reset successfully';
  }


  
}



  // async sendEmailForgotPassword(email: string){
  //   var findUser = await this.prismaService.user.findUnique({
  //     where:{email}
  //   });

  //   if(!findUser){
  //     throw new HttpException("LOGIN.USER_NOT_FOUND", HttpStatus.NOT_FOUND);
  //   }

  //   var tokenModel = await this.createForgottenPasswordToken(email);

  //   if(tokenModel && tokenModel.newPasswordToken){
  //     let 

  //   }
  // }


  // async createForgottenPasswordToken(email: string){

  // }




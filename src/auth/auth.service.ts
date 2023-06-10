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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

      const findPermissions = await this.prismaService.role.findUnique({
        where: { id: findUser.roleId },
        include: {
          permissions: true,
        },
      });

      // console.log('users permissions', findPermissions);

      // const permi = Object.assign({}, findPermissions.permissions);
      const permi = findPermissions.permissions;
      // console.log('permii', permi);
      // console.log('>>>', permi[0].name);

      const ob = {};

      for (var i = 0; i < permi.length; i++) {
        // console.log(permi[i].name);
        ob[i] = permi[i].name;
      }

      console.log('obb', ob);

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
        permissions: ob,
      });

      console.log('token', token);

      if (!token) {
        throw new ForbiddenException();
      }
      const decodet = this.jwtService.decode(token);
      res.cookie('token', token, {});

      if (findUser.roleId == 2) {
        res.redirect('/orders/admin_dashboard');
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
      res.redirect('/auth/signin');
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

  async signToken(args: {
    id: string;
    email: string;
    roleId: number;
    permissions: object;
  }) {
    const payload = args;
    return this.jwtService.signAsync(payload, { secret: jwtSecret });
  }

  async googleAuth(req, res) {
    if (!req.user) {
      return 'no user from google';
    }

    res.redirect('/users/user_home');
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.prismaService.user.findMany({
      include: { role: true },
    });

    return { users };
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return 'User not found';
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    await this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        otp: otp,
      },
    });
    const mail = await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'rajni901@gmail.com', // sender address
      subject: 'Forgot Password', // Subject line
      text: 'Forgot Password', // plaintext body
      html: `<b>Forgot Password</b>
            <p>OTP: ${otp}</p>`, // HTML body content
    });
    return mail;
    // return res.redirect('/auth/otp');
  }

  async verifyOtp(otp: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        otp: +otp,
      },
    });
    if (!user) {
      return 'Incorrect otp';
    }
    return 'Correct otp';
  }

  async resetPassword(password: string, otp: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        otp: +otp,
      },
    });
    if (!user) {
      return 'Incorrect otp';
    }
    const hashedPassword = await this.hashPassword(password);

    // const passwordHash = await argon.hash(password);
    await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        hashedPassword: hashedPassword,
      },
    });
    return 'Password reset successfully';
  }

  async search(req, res) {
    try {
      const page = req.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const search = await this.prismaService.user.findMany({
        skip: skip,
        take: perPage,
        where: {
          roleId: 1,
          OR: [
            {
              email: {
                startsWith: req.data,
              },
            },
            {
              name: {
                startsWith: req.data,
              },
            },
          ],
        },
        include: { role: true },
      });
      return search;
    } catch (error) {
      throw error;
    }
  }

  async getUserFromToken(req: Request, res: Response) {
    const { token } = req.cookies;

    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    const uid = user.id;
    return uid;
  }
}

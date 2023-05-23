import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }
  async signup(createAuthDto: CreateAuthDto) {
    try {
      const { name, email, password, roleId } = createAuthDto;

      const findUser = await this.prismaService.user.findUnique({ where: { email } })

      if (findUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      await this.prismaService.user.create({
        data: {
          name,
          email,
          hashedPassword, 
          roleId
        }
      })
      // return this.prismaService.user.create(createAuthDto)
      return "signup"
    } catch (err) {
      throw err
    }
  }

  async signin(email: string, password: string, req: Request, res: Response) {


    try {

      const findUser = await this.prismaService.user.findUnique({ where: { email } })

      if (!findUser) {
        throw new BadRequestException('Wrong Credentials');
      }

      const isMatch = await this.comparePasswords({
        password,
        hash: findUser.hashedPassword
      });

      if (!isMatch) {
        throw new BadRequestException('Wrong Credentials');
      }

      const token = await this.signToken({ id: findUser.id, email: findUser.email })

      if (!token) {
        throw new ForbiddenException()
      }
      res.cookie('token', token, {})
      res.redirect('/users')

      // return res.send({ message: 'Logged in successfull' })
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

  async comparePasswords(args: { password: string, hash: string }) {
    return await bcrypt.compare(args.password, args.hash);

  }

  async signToken(args: { id: string, email: string }) {
    const payload = args
    return this.jwtService.signAsync(payload, { secret: jwtSecret })
  }
  
  async googleAuth(req, res){
    if(!req.user){
        return "no user from google";
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
    console.log("user",req.user);
    
    
    res.render('admin');

}

}

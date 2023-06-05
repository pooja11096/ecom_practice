import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from 'src/utils/constants';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
      ]),
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload) {

    // alert('validate');
    
    const { id,email,roleId} = payload;



    const user = await prisma.user.findUnique({where:{id}, include:{role:true}});
    console.log('finduser', user);
    

    if(!user){
      throw new UnauthorizedException('Login first to access this page');
    }
    console.log("validate");


    // return user;

    return payload;
  }
}
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.enum';
import { Permissions } from '../entities/role.enum';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export default class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private prismaService: PrismaService) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Permissions[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }

    const response = context.switchToHttp().getResponse();

    const request = context.switchToHttp().getRequest();

    const { token } = request.cookies;

    if (!token) {
      response.render('error');
    }

    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );

    const roles = this.prismaService.role.findMany({
        include:{
            permissions: true
        }
    })

    console.log("permission", roles);
    

    // if (user.roleId == 1) {
    //   var hasRole = 'User';
    // } else {
    //   var hasRole = 'Admin';
    // }


    // return requireRoles.some((role) => permiss.includes(role));
  }
}

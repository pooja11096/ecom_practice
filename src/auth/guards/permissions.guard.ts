import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.enum';
import { Permission } from '../entities/permissions.enum';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export default class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Permissions[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    console.log('require permissions: ', requireRoles);

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

    // console.log('user', user);

    // const roles = this.prismaService.role.findMany({
    //   include: {
    //     permissions: true,
    //   },
    // });

    console.log('permission', user.permissions);
    const permissions = user.permissions;
    console.log('permissions...', permissions);

    // const permissions = ['read','write']
    console.log('perrfjgh', permissions.length);
    console.log('value', permissions[0]);
    console.log('ob to arr', Object.values(permissions));
    const permissionArr = Object.values(permissions);

    let value = [];
    for (var i = 0; i < permissions.length; i++) {
      value.push(permissions[i]);
    }

    console.log('value arr', value);

    // if (user.roleId == 1) {
    //   var hasRole = 'User';
    // } else {
    //   var hasRole = 'Admin';
    // }
    console.log(
      requireRoles.some((permission) => permissionArr.includes(permission)),
    );

    return requireRoles.some((permission) =>
      permissionArr.includes(permission),
    );
  }
}

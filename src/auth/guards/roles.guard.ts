import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.enum';
import { Request, Response } from 'express';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
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

    if (user.roleId == 1) {
      var hasRole = 'User';
    } else {
      var hasRole = 'Admin';
    }

    return requireRoles.some((role) => hasRole.includes(role));
  }
}

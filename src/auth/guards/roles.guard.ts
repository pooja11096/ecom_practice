import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../entities/role.enum";
import { Request } from 'express';


@Injectable()

export default class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean{


        const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles',[
            context.getHandler(),
            context.getClass(),
        ])

        console.log("requireRoles",requireRoles);
        

        if(!requireRoles){
            return true;
        }
        
        // const request = context.switchToHttp().getRequest();
        // const response = context.switchToHttp().getResponse();
        // const token = request.cookies['jwt'];
        // const user = request.user;
    
        const request = context.switchToHttp().getRequest();
        // const user = request.body;
        // console.log(roleId);
        const { token } = request.cookies;
        console.log(request.cookies);
        
        console.log(token);
        
        const user = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
            );
        console.log(user.roleId);
        
        if(user.roleId == 1){
            var hasRole = 'User'
        }else{
            var hasRole = 'Admin'
        }
        // const user = request.user;

        // console.log(request);
        
        // const hasrole = user.roleId;
        return requireRoles.some((role) =>hasRole.includes(role));
    }

}
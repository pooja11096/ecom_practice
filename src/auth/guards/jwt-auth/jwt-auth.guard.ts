// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';

import { Injectable } from "@nestjs/common";
import { AuthGuard} from "@nestjs/passport"

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return true;
//   }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}

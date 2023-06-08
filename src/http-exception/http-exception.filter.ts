// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import {Request, Response} from 'express'

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//   // host.switchToHttp().getResponse().status(exception.getStatus()).send(" my custom error message ")

//   const ctx = host.switchToHttp();
//   const response = ctx.getResponse<Response>();
//   const request = ctx.getRequest<Request>();
//   const status = exception.getStatus();

//   response
//   .status(status)
//     .json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });

//   }

// }

// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   Logger,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(HttpExceptionFilter.name);

//   constructor(private configService: ConfigService) {}

//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const status = exception.getStatus();

//     const isProduction =
//       this.configService.get<string>('NODE_ENV') === 'production';

//     this.logger.error(`Exception: ${exception.message}, status: ${status}`);

//     response.status(status).json(
//       isProduction
//         ? {
//             statusCode: status,
//             timestamp: new Date().toISOString(),
//             message: exception.message,
//           }
//         : {
//             statusCode: status,
//             timestamp: new Date().toISOString(),
//             message: exception.message,
//             stacktrace: exception.stack,
//           },
//     );
//   }
// }

// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from "@nestjs/common";

// @Catch()
// export class HttpExecptionFilter<T> implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     host
//       .switchToHttp()
//       .getResponse()
//       .status(exception.getStatus())
//       .render("error");
//   }
// }

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.render('error');
  }
}

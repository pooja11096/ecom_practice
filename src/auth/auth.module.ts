import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [JwtModule, PassportModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,GoogleStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}

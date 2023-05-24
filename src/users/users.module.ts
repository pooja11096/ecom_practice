import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
// import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy]
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import RolesGuard from 'src/auth/guards/roles.guard';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, CategoriesModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, CategoriesService]
})
export class UsersModule {}

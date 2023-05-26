import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MulterModule } from '@nestjs/platform-express';


// MulterModule.register({
//   dest: "./files",
//   }),
@Module({
  imports: [AuthModule, PrismaModule, UsersModule, ProductsModule, CategoriesModule, MulterModule.register({
    dest: "../uploads",
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

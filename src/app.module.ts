import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';
import RolesGuard from './auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { GoogleStrategy } from './auth/google.strategy';


// MulterModule.register({
//   dest: "./files",
//   }),
@Module({
  imports: [AuthModule,JwtModule, PrismaModule, UsersModule, ProductsModule, CategoriesModule, MulterModule.register({
    dest: "./files",
  }), RolesModule,ConfigModule.forRoot({
    isGlobal: true, // no need to import into other modules
  }), CartModule, OrdersModule,],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule {}

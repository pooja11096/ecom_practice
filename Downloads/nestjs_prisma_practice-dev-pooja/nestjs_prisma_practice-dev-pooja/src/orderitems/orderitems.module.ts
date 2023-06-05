import { Module } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { OrderitemsController } from './orderitems.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [OrderitemsController],
  providers: [PrismaService,OrderitemsService]
})
export class OrderitemsModule {}

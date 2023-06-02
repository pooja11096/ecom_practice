import { Global, Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
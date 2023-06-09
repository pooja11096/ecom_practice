import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request, Response } from 'express';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  // prismaService: any;
  async create(createRoleDto: CreateRoleDto) {
    const { name } = CreateRoleDto;

    return await this.prismaService.role.create({
      data: {
        name,
      },
      include: {
        permissions: true,
      },
    });

    // return await this.prismaService.createRole(createRoleDto)
    // return 'This action adds a new role';
  }

  async findAll() {
    const roles = await this.prismaService.role.findMany({
      include: {
        permissions: true,
      },
    });
    const permissions = await this.prismaService.permission.findMany({});

    console.log('dfg', roles);

    console.log('fglkjh', permissions);

    return { roles, permissions };
    // return `This action returns all roles`;
  }

  async getAllPermissions(req: Request, res: Response) {
    const permission = await this.prismaService.permission.findMany({});
    res.send(permission);
  }

  async createPermissions(permission_name: string) {
    return await this.prismaService.permission.create({
      data: {
        name: permission_name,
      },
    });
  }

  async updatePermission(roleId: number, permissionId: string, req, res) {
    console.log('update permission');

    await this.prismaService.role.update({
      where: { id: +roleId },
      data: {
        permissions: {
          set: [],
        },
      },
    });

    return await this.prismaService.role.update({
      where: { id: 1 },
      data: {
        permissions: {
          connect: { id: permissionId },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.role.findUnique({
      where: { id: id },
      include: {
        permissions: true,
      },
    });
    // return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

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

  async updatePermission(roleId: number, permissionId: string) {
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
      where: { id: +roleId },
      data: {
        permissions: {
          connect: { id: permissionId },
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async tryupdatePermission(roleId: number, permissionIds: string[]) {
    console.log('update permission');
    console.log('>>>', permissionIds);

    await this.prismaService.role.update({
      where: { id: +roleId },
      data: {
        permissions: {
          set: [],
        },
      },
    });

    // const role = await this.prismaService.role.findUnique({
    //   where: { id: roleId },
    //   include: { permissions: true }, // Include the current permissions associated with the role
    // });

    // console.log('rolee', role);

    // // Fetch or create the permissions based on the input data
    // const permissions = await this.prismaService.permission.findMany({
    //   where: { id: { in: permissionIds } },
    // });

    // console.log('permissionss', permissions);

    // // Associate the permissions with the role
    // role.permissions = [...role.permissions, ...permissions];

    return await this.prismaService.role.update({
      where: { id: +roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      // data: {
      //   permissions: {
      //     connect: permissionId.map((id) => ({ id })),
      //   },
      // },
      include: {
        permissions: true,
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

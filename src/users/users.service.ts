import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getOrdersDetails(req: Request, res: Response) {
    const orders = await this.prismaService.order.findMany();
    return { orders };
  }

  async createUser(createUserDto: CreateUserDto, req: Request, res: Response) {
    try {
      const { name, email, password, roleId } = createUserDto;

      // if(role == 'Admin'){
      //   const roleId = 2
      // }else{
      //   const roleId = 1
      // }

      console.log('type', typeof roleId);

      const findUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (findUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      const users = await this.prismaService.user.create({
        data: {
          name,
          email,
          hashedPassword,
          roleId: +roleId,
        },
      });

      res.redirect('/users/user');
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(req, res) {
    // const { draw, search, order } = req.query;
    const { token } = req.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    console.log(user.id);
    const uid = user.id;

    const total = await this.prismaService.user.count({
      where: { id: { not: uid } },
    });

    const page = req.query.page || 1;
    const perPage = 4;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    console.log('skip', skip);

    const query = {
      where: { id: { not: uid } },
      include: { role: true },
      take: perPage,
      skip: skip,
    };
    const lastPage = Math.ceil(total / perPage);
    console.log('users lpg', lastPage);

    // const columns = ['id', 'name', 'email'];

    // const query = {
    //   where: {
    //     roleId: 1,
    //   },
    //   include: { role: true },
    // };
    // const total = await this.prismaService.user.count();
    // console.log("total user", total);

    const users = await this.prismaService.user.findMany(query);

    return { users, lastPage };
    return res.json({
      data: users,
    });
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.prismaService.user.findMany({
        include: { role: true },
      });

      return res.json({ data: users });
    } catch (err) {
      throw err;
    }
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    req: Request,
    res: Response,
  ) {
    const { name, email, roleId } = updateUserDto;
    console.log(updateUserDto);

    await this.prismaService.user.update({
      where: { id: id },
      data: {
        name,
        email,
        roleId: +roleId,
      },
    });
  }

  async deleteUser(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findUser(id: string, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    res.send(user);
  }

  async sortData(order) {
    try {
    } catch (err) {
      throw err;
    }
  }

  // async searchUser(search: string) {
  //   try {
  //     return await this.prismaService.user.findMany({
  //       where: {
  //         AND: [
  //           { name: { contains: search } },
  //           { email: { contains: search } },
  //         ],
  //       },
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async searchData(
  //   search: string,
  //   order: string,
  //   sortBy: string,
  //   page: number,
  //   pagesize: number,
  // ) {
  //   try {
  //     await this.prismaService.user.findMany({
  //       where: {
  //         AND: [
  //           { name: { contains: search } },
  //           { email: { contains: search } },
  //         ],
  //       },
  //       orderBy: {
  //         [sortBy]: order,
  //       },
  //       skip: (page - 1) * pagesize,
  //       take: pagesize,
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async sort(req, res, reqq: Request) {
    const { token } = reqq.cookies;
    const user = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    console.log(user.id);
    const uid = user.id;
    const page = req.page || 1;
    const perPage = 4;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    try {
      if (req.data == 'name') {
        const sort = await this.prismaService.user.findMany({
          where: { id: { not: uid } },
          skip: skip,
          take: perPage,
          orderBy: {
            name: req.type,
          },
          include: { role: true },
        });
        return sort;
      } else if (req.data == 'email') {
        const sort = await this.prismaService.user.findMany({
          skip: skip,
          take: perPage,
          orderBy: {
            email: req.type,
          },
          include: { role: true },
        });
        return sort;
      }
    } catch (error) {
      throw error;
    }
  }

  async pagination(req, res) {
    try {
      const { token } = req.cookies;
      const user = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
      console.log(user.id);
      const uid = user.id;
      const page = req.query.page || 1;
      const perPage = 4;

      if (page > 0) {
        var skip = perPage * (page - 1);
      } else {
        var skip = 0;
      }
      // const skip = page>0?perPage*(page-1):0;

      // const skip = page>0 ? perPage * (page - 1) : 0;
      const category = await this.prismaService.user.findMany({
        where: { id: { not: uid } },

        skip: skip,
        take: perPage,
        include: { role: true },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }
}

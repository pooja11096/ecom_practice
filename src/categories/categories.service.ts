import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request, Response } from 'express';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    req: Request,
    res: Response,
  ) {
    await this.prismaService.category.create({ data: createCategoryDto });
    res.redirect('/categories');
  }

  async findCategory() {
    return await this.prismaService.category.findMany({});
  }

  async getAllCategory(req, res) {
    const total = await this.prismaService.category.count();

    const categories = await this.prismaService.category.findMany();
    return { categories };
  }
  async findAllCategory(req, res: Response) {
    const total = await this.prismaService.category.count();

    const page = req.query.page || 1;
    const perPage = 4;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const query = {
      take: perPage,
      skip: skip,
    };
    const lastPage = Math.ceil(total / perPage);

    const categories = await this.prismaService.category.findMany(query);
    return { categories, lastPage };
  }

  async findOne(id: string) {
    return this.prismaService.category.findUnique({ where: { id } });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    req: Request,
    res: Response,
  ) {
    const { category_name } = updateCategoryDto;
    return this.prismaService.category.update({
      where: { id },
      data: {
        category_name,
      },
    });
  }

  async remove(id: string) {
    await this.prismaService.category.delete({ where: { id } });
  }

  async search(req, res) {
    try {
      const page = req.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const search = await this.prismaService.category.findMany({
        skip: skip,
        take: perPage,
        where: {
          OR: [
            {
              category_name: {
                startsWith: req.data,
              },
            },
          ],
        },
      });
      return search;
    } catch (error) {
      throw error;
    }
  }

  async sort(req, res) {
    try {
      const page = 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const sort = await this.prismaService.category.findMany({
        skip: skip,
        take: perPage,
        orderBy: {
          category_name: req.type,
        },
      });
      return sort;
    } catch (error) {
      throw error;
    }
  }

  async pagination(req, res) {
    try {

      const page = req.query.page || 1;
      const perPage = 4;

      const skip = page > 0 ? perPage * (page - 1) : 0;
      const category = await this.prismaService.category.findMany({
        skip: skip,
        take: perPage,
      });

      return category;
    } catch (error) {
      throw error;
    }
  }
}

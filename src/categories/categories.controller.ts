import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Render, Put } from '@nestjs/common';
import { Role } from 'src/auth/entities/role.enum';
import { Roles } from 'src/auth/entities/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto,@Req() req, @Res() res) {
    return this.categoriesService.create(createCategoryDto,req,res);
  }

  // @Get()
  // @Roles(Role.ADMIN)
  // @Render('manage_categories')
  // manageCategories(){
  // }

  @Get('/user_home')
  @Render('users_panel')
  getCatList(@Req() req, @Res() res){
    return this.categoriesService.findAllCategory(req, res);
  }

  @Get('/add_product_page')
  @Render('add_product')
  getAddProductPage(@Req() req, @Res() res){
    return this.categoriesService.findAllCategory(req, res);
  }

  @Get('add_category_page')
  @Render('add_category')
  addCategoryPage(){

  }

  @Get()
  @Roles(Role.ADMIN)
  @Render('categories_crud')
  findAll(@Req() req, @Res() res) {
    return this.categoriesService.findAllCategory(req, res);
  }

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto,@Req() req: any, @Res() res) {
    return this.categoriesService.update(id, updateCategoryDto, req, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

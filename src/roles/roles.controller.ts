import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { resolve } from 'path/posix';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // @Get()
  // @Render('r_p.ejs')
  // findAll(@Req() req, @Res() res) {
  //   return this.rolesService.findAll();
  // }

  @Get('/role')
  @Render('r_p')
  findAllR() {
    return this.rolesService.findAll();
  }

  @Get('/permissions')
  getPermission() {
    return this.rolesService.getAllPermissions();
  }

  @Post('/permissions')
  createPermission(@Body('permission_name') permission_name: string) {
    return this.rolesService.createPermissions(permission_name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put('id')
  updateP(
    @Param('roleId') roleId: number,
    @Body('permissionId') permissionId: string,
  ) {
    return this.rolesService.updatePermission(+roleId, permissionId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
function req() {
  throw new Error('Function not implemented.');
}

import { SetMetadata } from '@nestjs/common';
import { Permission } from '../entities/permissions.enum';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);

console.log('decorator permissions', Permissions);

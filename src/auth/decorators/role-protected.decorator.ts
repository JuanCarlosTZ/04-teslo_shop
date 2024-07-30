import { SetMetadata } from '@nestjs/common';
import { META_ROLE, ValidRoles } from '../helpers/roles.helper';

export const RoleProtected = (...args: ValidRoles[]) => {
    return SetMetadata(META_ROLE, args);
};

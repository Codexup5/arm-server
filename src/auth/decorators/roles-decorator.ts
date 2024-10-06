import { SetMetadata } from '@nestjs/common';

import { ROLE_KEY } from 'auth/constants';

import { Role } from 'models/user/user.enums';

export const HasRoles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);

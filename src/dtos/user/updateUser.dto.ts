import { IntersectionType } from '@nestjs/swagger';

import { CreateUserDto } from './creatUser.dto';

import { User } from 'models/user/user.model';

export class UpdateUserDto extends IntersectionType(CreateUserDto, User) {}

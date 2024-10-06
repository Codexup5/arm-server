import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InsertResult } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { PASSWORD_HASH_ROUNDS } from 'common/constants/base';
import { AUTH_SERVICE_ERROR } from 'common/constants/errors/auth.errors';
import { USER_NOT_FOUND } from 'common/constants/errors/user.errors';
import { AccessToken, UserPayload } from 'common/interfaces';
import handleAsyncError from 'common/utils/errors/handleAsyncError';

import { ConfigurationService } from 'config/configuration.service';

import { CreateUserDto } from 'dtos/user/creatUser.dto';

import { Role } from 'models/user/user.enums';
import { User } from 'models/user/user.model';

import { UsersService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigurationService,
    ) {}

    async validateUser(email: string, password: string): Promise<Partial<User>> {
        return await handleAsyncError('validateUser', AUTH_SERVICE_ERROR, async () => {
            const user = await this.usersService.findOne({
                where: { email },
                select: ['id', 'role', 'password'],
            });

            if (!user) {
                throw new NotFoundException(USER_NOT_FOUND);
            }
            const compareResult = await bcrypt.compare(password, user.password);

            if (compareResult) {
                return { id: user.id, role: user.role };
            } else {
                throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
            }
        });
    }

    signJwt(payload: UserPayload) {
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.jwtExpiresIn,
        });
    }

    async login({ id, role }: UserPayload): Promise<AccessToken> {
        return await handleAsyncError('login', AUTH_SERVICE_ERROR, async () => {
            const accessToken = this.signJwt({ id, role });

            return await { accessToken };
        });
    }

    async register(createUserDto: CreateUserDto, role: Role): Promise<InsertResult> {
        return await handleAsyncError('register', AUTH_SERVICE_ERROR, async () => {
            const isExists = await this.usersService.isUserExists({
                email: createUserDto.email,
            });

            if (isExists) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }

            const hashedPassword = await bcrypt.hash(createUserDto.password, PASSWORD_HASH_ROUNDS);

            const user = await this.usersService.createOne(
                {
                    ...createUserDto,
                    password: hashedPassword,
                },
                role,
            );

            return user;
        });
    }
}

import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { InsertResult } from 'typeorm';

import { JwtAuthGuard } from 'auth/guards/jwt.guard';
import { LocalAuthGuard } from 'auth/guards/local.guard';

import { AccessToken, RequestWithUser } from 'common/interfaces';

import { Role } from 'models/user/user.enums';
import { User } from 'models/user/user.model';

import { AuthService } from 'services/auth.service';
import { UsersService } from 'services/user.service';

@ApiTags('Authorization')
@Controller('/auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() { user: { id, role } }: RequestWithUser): Promise<AccessToken> {
        return await this.authService.login({ id, role });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/check')
    async check(@Req() { user: { id } }: RequestWithUser): Promise<User | null> {
        return await this.usersService.findOne({ where: { id } });
    }

    @Post('/register')
    async register(@Req() req: Request, @Query('role') role: Role): Promise<InsertResult> {
        return this.authService.register(req.body, role);
    }
}

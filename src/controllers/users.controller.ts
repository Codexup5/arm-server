import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsertResult } from 'typeorm';

import { RoleGuard } from 'auth/guards/role.guard';

import { CreateUserDto } from 'dtos/user/creatUser.dto';
import { UpdateUserDto } from 'dtos/user/updateUser.dto';

import { Role } from 'models/user/user.enums';
import { User } from 'models/user/user.model';

import { UsersService } from 'services/user.service';
import { HasRoles } from 'auth/decorators/roles-decorator';

@ApiTags('User')
@Controller('/users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ description: 'Создание пользователя в базе данных' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Post()
    async createOne(
        @Body() createUserDto: CreateUserDto,
        @Query('role') role: Role,
    ): Promise<InsertResult> {
        return await this.usersService.createOne(createUserDto, role);
    }

    @ApiOperation({ description: 'Получение всех пользовтелей' })
    @HasRoles(Role.Admin)
    @UseGuards(RoleGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @ApiOperation({ description: 'Получение пользователя по id' })
    @HasRoles(Role.Admin)
    @UseGuards(RoleGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null> {
        return this.usersService.findOne({ where: { id } });
    }

    @ApiOperation({ description: 'Обновление данных ондного пользователя' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Post(':id')
    updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateOne(id, updateUserDto);
    }

    @ApiOperation({ description: 'Удаление пользователя по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Delete(':id')
    deleteOneById(@Param('id') id: string) {
        return this.usersService.deleteOneById(id);
    }
}

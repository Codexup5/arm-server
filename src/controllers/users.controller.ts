import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InsertResult } from 'typeorm';

import { CreateUserDto } from 'dtos/user/creatUser.dto';
import { UpdateUserDto } from 'dtos/user/updateUser.dto';

import { Role } from 'models/user/user.enums';
import { User } from 'models/user/user.model';

import { UsersService } from 'services/user.service';

@ApiTags('User')
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ description: 'Создание пользователя в базе данных' })
    @Post()
    async createOne(
        @Body() createUserDto: CreateUserDto,
        @Query('role') role: Role,
    ): Promise<InsertResult> {
        return await this.usersService.createOne(createUserDto, role);
    }

    @ApiOperation({ description: 'Получение всех пользовтелей' })
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @ApiOperation({ description: 'Получение пользователя по id' })
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null> {
        return this.usersService.findOne({ where: { id } });
    }

    @ApiOperation({ description: 'Обновление данных ондного пользователя' })
    @Post(':id')
    updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateOne(id, updateUserDto);
    }

    @ApiOperation({ description: 'Удаление пользователя по id' })
    @Delete(':id')
    deleteOneById(@Param('id') id: string) {
        return this.usersService.deleteOneById(id);
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, FindOptionsWhere, InsertResult, Repository } from 'typeorm';

import { USER_NOT_FOUND, USER_SERVICE_ERROR } from 'common/constants/errors/user.errors';
import handleAsyncError from 'common/utils/errors/handleAsyncError';

import { CreateUserDto } from 'dtos/user/creatUser.dto';
import { UpdateUserDto } from 'dtos/user/updateUser.dto';

import { Role } from 'models/user/user.enums';
import { User } from 'models/user/user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createOne(createUserDto: CreateUserDto, role: Role): Promise<InsertResult> {
        return await handleAsyncError('createOne', USER_SERVICE_ERROR, async () => {
            createUserDto.role = role;

            return await this.usersRepository.insert(createUserDto);
        });
    }

    async findAll(): Promise<User[]> {
        return await handleAsyncError('findAll', USER_SERVICE_ERROR, async () => {
            return await this.usersRepository.find();
        });
    }

    async findOne(parameter: FindOneOptions<User>): Promise<User | null> {
        return await handleAsyncError('findOne', USER_SERVICE_ERROR, async () => {
            const user = await this.usersRepository.findOne(parameter);

            if (!user) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            return await this.usersRepository.findOne(parameter);
        });
    }

    async findOneById(id: string): Promise<User | null> {
        return await handleAsyncError('findOneById', USER_SERVICE_ERROR, async () => {
            return await this.usersRepository.findOne({ where: { id } });
        });
    }

    async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return await handleAsyncError('updateOne', USER_SERVICE_ERROR, async () => {
            updateUserDto.updateDate = new Date();

            return await this.usersRepository.save({ id, ...updateUserDto });
        });
    }

    async deleteOneById(id: string): Promise<DeleteResult> {
        return await handleAsyncError('deleteOneById', USER_SERVICE_ERROR, async () => {
            const isExists = await this.isUserExists({ id });

            if (!isExists) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            return await this.usersRepository.delete(id);
        });
    }

    async isUserExists(transactionProperty: FindOptionsWhere<User>): Promise<boolean> {
        return await handleAsyncError('isUserExists', USER_SERVICE_ERROR, async () => {
            return await this.usersRepository.exists({ where: transactionProperty });
        });
    }
}

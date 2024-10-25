import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { EMPLOYEE_NOT_FOUND, EMPLOYEE_SERVICE_ERROR } from 'common/constants/errors/employee.error';
import { PageMetaDto } from 'common/pagination/dtos/page-meta.dto';
import { PageOptionsDto } from 'common/pagination/dtos/page-options.dto';
import { PageDto } from 'common/pagination/dtos/page.dto';
import getSQLSearch from 'common/utils/base/array/getSQLSearch';
import getErrorMessage from 'common/utils/errors/getErrorMessage';
import handleAsyncError from 'common/utils/errors/handleAsyncError';

import { CreateEmployeeDto } from 'dtos/employee/createEmployee';
import { UpdateEmployeeDto } from 'dtos/employee/updateEmployee';

import { AllowedEmployeeRelations } from 'controllers/employee.controller';

import { Employee } from 'models/employee/employee.model';
import { SuccessfullyUpdatedEntityResponse } from 'common/interfaces';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) {}

    get name() {
        return Employee.name.toLowerCase();
    }

    async createOne(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return await handleAsyncError('createOne', EMPLOYEE_SERVICE_ERROR, async () => {
            const employee = this.employeesRepository.create(createEmployeeDto);

            employee.createDate = new Date();
            employee.lastChangeDate = new Date();

            return await this.employeesRepository.save(employee);
        });
    }

    async findAll(): Promise<Employee[]> {
        return await handleAsyncError('findAll', EMPLOYEE_SERVICE_ERROR, async () => {
            return await this.employeesRepository.find({ where: { isArchived: false } });
        });
    }

    async findSome(
        pageOptionsDto: PageOptionsDto,
        relations: AllowedEmployeeRelations,
    ): Promise<PageDto<Employee>> {
        try {
            const includedInSearchFields = ['name', 'familyName', 'phoneNumber'];

            const queryBuilder = this.employeesRepository.createQueryBuilder(this.name);

            if (pageOptionsDto.searchBy) {
                queryBuilder.where(getSQLSearch(includedInSearchFields, this.name), {
                    s: `%${pageOptionsDto.searchBy}%`,
                });
            }

            queryBuilder
                .orderBy(`${this.name}.dateEmployment`, pageOptionsDto.order)
                .skip(pageOptionsDto.skip)
                .take(pageOptionsDto.limit);

            if (relations.length > 0) {
                relations.forEach((relation) => {
                    queryBuilder.leftJoinAndSelect(`${this.name}.${relation}`, relation);
                });
            }

            const total = await queryBuilder.getCount();
            const { entities } = await queryBuilder.getRawAndEntities();

            const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });

            return new PageDto(entities, pageMetaDto);
        } catch (error) {
            throw new Error(`users.service | findSome error: ${getErrorMessage(error)}`);
        }
    }

    async findOne(parameter: FindOneOptions<Employee>): Promise<Employee | null> {
        return await handleAsyncError('findOne', EMPLOYEE_SERVICE_ERROR, async () => {
            const employee = await this.employeesRepository.findOne(parameter);

            if (!employee) {
                throw new NotFoundException(EMPLOYEE_NOT_FOUND);
            }

            return employee;
        });
    }

    async findOneById(id: string): Promise<Employee | null> {
        return await handleAsyncError('findOneById', EMPLOYEE_SERVICE_ERROR, async () => {
            return await this.employeesRepository.findOne({ where: { id } });
        });
    }

    async updateOneById(
        id: string,
        updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<SuccessfullyUpdatedEntityResponse<Employee>> {
        return await handleAsyncError('updateOneById', EMPLOYEE_SERVICE_ERROR, async () => {
            updateEmployeeDto.lastChangeDate = new Date();

            const message = 'Successfully updated!';

            const result = await this.employeesRepository.save({ id, ...updateEmployeeDto });

            return {
                success: true,
                message,
                newFields: result,
            };
        });
    }

    async archiveOneById(id: string): Promise<Employee> {
        return await handleAsyncError('archiveOneById', EMPLOYEE_SERVICE_ERROR, async () => {
            const isExists = await this.isEmployeeExists({ id });

            if (!isExists) {
                throw new NotFoundException(EMPLOYEE_NOT_FOUND);
            }

            await this.employeesRepository.update(id, { isActive: false, isArchived: true });

            return await this.employeesRepository.findOne({ where: { id } });
        });
    }

    async restoreFromArchive(id: string): Promise<Employee> {
        return await handleAsyncError('restoreFromArchive', EMPLOYEE_SERVICE_ERROR, async () => {
            const isExists = await this.isEmployeeExists({ id });

            if (!isExists) {
                throw new NotFoundException(EMPLOYEE_NOT_FOUND);
            }

            await this.employeesRepository.update(id, { isActive: true, isArchived: false });

            return await this.employeesRepository.findOne({ where: { id } });
        });
    }

    async deleteOneById(id: string): Promise<void> {
        return await handleAsyncError('deleteOneById', EMPLOYEE_SERVICE_ERROR, async () => {
            const isExists = await this.isEmployeeExists({ id });

            if (!isExists) {
                throw new NotFoundException(EMPLOYEE_NOT_FOUND);
            }

            await this.employeesRepository.delete(id);
        });
    }

    async isEmployeeExists(transactionProperty: FindOptionsWhere<Employee>): Promise<boolean> {
        return await handleAsyncError('isUserExists', EMPLOYEE_SERVICE_ERROR, async () => {
            return await this.employeesRepository.exists({ where: transactionProperty });
        });
    }
}

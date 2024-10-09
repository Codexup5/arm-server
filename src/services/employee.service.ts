import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { EMPLOYEE_NOT_FOUND, EMPLOYEE_SERVICE_ERROR } from 'common/constants/errors/employee.error';
import handleAsyncError from 'common/utils/errors/handleAsyncError';

import { CreateEmployeeDto } from 'dtos/employee/createEmployee';
import { UpdateEmployeeDto } from 'dtos/employee/updateEmployee';

import { Employee } from 'models/employee/employee.model';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) {}

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

    async updateOne(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        return await handleAsyncError('updateOne', EMPLOYEE_SERVICE_ERROR, async () => {
            updateEmployeeDto.lastChangeDate = new Date();

            return await this.employeesRepository.save({ id, ...updateEmployeeDto });
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

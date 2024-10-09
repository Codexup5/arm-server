import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from 'controllers/employee.controller';

import { Employee } from 'models/employee/employee.model';

import { EmployeesService } from 'services/employee.service';

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    controllers: [EmployeeController],
    providers: [EmployeesService],
})
export class EmployeeModule {}

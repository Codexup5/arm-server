import { IntersectionType } from '@nestjs/swagger';

import { Employee } from 'models/employee/employee.model';

import { CreateEmployeeDto } from './createEmployee';

export class UpdateEmployeeDto extends IntersectionType(CreateEmployeeDto, Employee) {}

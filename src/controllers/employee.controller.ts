import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HasRoles } from 'auth/decorators/roles-decorator';
import { RoleGuard } from 'auth/guards/role.guard';
import { SuccessfullyUpdatedEntityResponse } from 'common/interfaces';
import { PageOptionsDto } from 'common/pagination/dtos/page-options.dto';
import { PageDto } from 'common/pagination/dtos/page.dto';

import { CreateEmployeeDto } from 'dtos/employee/createEmployee';
import { UpdateEmployeeDto } from 'dtos/employee/updateEmployee';

import { Employee } from 'models/employee/employee.model';
import { Role } from 'models/user/user.enums';

import { EmployeesService } from 'services/employee.service';

export type AllowedEmployeeRelations = ['name', 'familyName', 'phoneNumber'];

@ApiTags('Employees')
@Controller('/employees')
@ApiBearerAuth('JWT-auth')
export class EmployeeController {
    constructor(private readonly employeesService: EmployeesService) {}

    @ApiOperation({ description: 'Создание сотрудника в базе данных' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Post('/create')
    async createOne(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return await this.employeesService.createOne(createEmployeeDto);
    }

    @ApiOperation({ description: 'Получение всех сотрудников' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Get()
    async findAll(): Promise<Employee[]> {
        return await this.employeesService.findAll();
    }

    @ApiOperation({ description: 'Получение сотрудников порционно' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Get('/filter?')
    async findSome(
        @Query() pageOptionsDto: PageOptionsDto,
        @Query(
            'relations',
            new DefaultValuePipe([]),
            new ParseArrayPipe({
                items: String,
                separator: ',',
                optional: true,
            }),
        )
        relations: AllowedEmployeeRelations,
    ): Promise<PageDto<Employee>> {
        return await this.employeesService.findSome(pageOptionsDto, relations);
    }

    @ApiOperation({ description: 'Получение сотрудника по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Employee | null> {
        return await this.employeesService.findOneById(id);
    }

    @ApiOperation({ description: 'Обновление продукта по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Patch('/:id')
    async updateOneById(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<SuccessfullyUpdatedEntityResponse<Employee>> {
        return await this.employeesService.updateOneById(id, updateEmployeeDto);
    }

    @ApiOperation({ description: 'Архивация сотрудника по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Delete(':id/archive')
    async archiveOneById(@Param('id') id: string): Promise<Employee> {
        return await this.employeesService.archiveOneById(id);
    }

    @ApiOperation({ description: 'Восстановление сотрудника из архива по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Post(':id/restore')
    async restoreFromArchive(@Param('id') id: string): Promise<Employee> {
        return await this.employeesService.restoreFromArchive(id);
    }

    @ApiOperation({ description: 'Удаление сотрудника по id' })
    @HasRoles(Role.HR, Role.Admin)
    @UseGuards(RoleGuard)
    @Delete(':id')
    async deleteOneById(@Param('id') id: string) {
        return await this.employeesService.deleteOneById(id);
    }
}

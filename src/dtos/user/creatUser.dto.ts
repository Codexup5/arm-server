import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Role } from 'models/user/user.enums';

export class CreateUserDto {
    @ApiProperty({ name: 'id', uniqueItems: true })
    public id: string;

    @ApiProperty({ name: 'name', type: 'varchar', maxLength: 50, required: true })
    @MaxLength(50)
    @IsNotEmpty()
    public name: string;

    @ApiProperty({ name: 'familyName', type: 'varchar', maxLength: 50, required: true })
    @MaxLength(50)
    public familyName: string;

    @ApiProperty({ name: 'patronymic', type: 'varchar', maxLength: 50, required: true })
    @MaxLength(50)
    public patronymic: string;

    @ApiProperty({
        name: 'email',
        type: 'varchar',
        minLength: 10,
        maxLength: 30,
        uniqueItems: true,
        required: true,
    })
    @MinLength(10)
    @MaxLength(30)
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @ApiProperty({ name: 'password', type: 'varchar', minLength: 6, maxLength: 30, required: true })
    @MinLength(6)
    @MaxLength(30)
    @IsNotEmpty()
    public password: string;

    @ApiProperty({ name: 'role', type: 'enum', enum: Role, default: Role.HR, required: true })
    public role: Role;

    @ApiProperty({
        name: 'registrationDate',
        type: 'timestamptz',
        default: new Date(),
        required: false,
    })
    @IsDate()
    public registrationDate: Date;

    @ApiProperty({ name: 'updateDate', type: 'timestamptz', default: new Date(), required: false })
    @IsDate()
    public updateDate: Date;
}

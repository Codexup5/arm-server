import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
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
        name: 'phoneNumber',
        type: 'varchar',
        minLength: 11,
        maxLength: 11,
        required: true,
    })
    @MaxLength(11)
    @MinLength(11)
    @IsNotEmpty()
    public phoneNumber: string;

    @ApiProperty({ name: 'department', type: 'varchar', maxLength: 100, required: true })
    @MaxLength(100)
    @IsNotEmpty()
    public department: string;

    @ApiProperty({ name: 'position', type: 'varchar', maxLength: 100, required: true })
    @MaxLength(100)
    @IsNotEmpty()
    public position: string;

    @ApiProperty({
        name: 'salary',
        type: 'numeric',
        minimum: 150000,
        maximum: 5000000,
        default: 150000,
        required: false,
    })
    @MaxLength(5000000)
    @MinLength(150000)
    public salary: number;

    @ApiProperty({
        name: 'dateEmployment',
        type: 'timestamptz',
        default: new Date(),
        required: false,
    })
    @IsDate()
    public dateEmployment: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IsDate } from 'class-validator';

import { Role } from './user.enums';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'name', type: 'varchar' })
    public name: string;

    @Column({ name: 'family_name', type: 'varchar' })
    public familyName: string;

    @Column({ name: 'patronymic', type: 'varchar' })
    public patronymic: string;

    @Column({ name: 'email', type: 'varchar', unique: true })
    public email: string;

    @Column({ name: 'password', type: 'varchar', select: false })
    public password: string;

    @Column({ name: 'role', type: 'enum', enum: Role, default: Role.HR })
    public role: Role;

    @Column({ name: 'registration_date', type: 'timestamptz', default: new Date() })
    @IsDate()
    public registrationDate: Date;

    @Column({ name: 'update_date', type: 'timestamptz', default: new Date() })
    @IsDate()
    public updateDate: Date;
}

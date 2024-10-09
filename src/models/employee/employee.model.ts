import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'models/base/base.model';

@Entity('employee')
export class Employee extends BaseEntity {
    @Column({ name: 'name', type: 'varchar' })
    public name: string;

    @Column({ name: 'family_name', type: 'varchar' })
    public familyName: string;

    @Column({ name: 'patronymic', type: 'varchar', nullable: true })
    public patronymic: string;

    @Column({ name: 'phone_number', type: 'varchar' })
    public phoneNumber: string;

    @Column({ name: 'department', type: 'varchar' })
    public department: string;

    @Column({ name: 'position', type: 'varchar' })
    public position: string;

    @Column({
        name: 'salary',
        type: 'numeric',
        scale: 2,
        precision: 10,
        default: 150000,
        nullable: false,
    })
    public salary: number;

    @Column({ name: 'date_employment', type: 'timestamptz', default: new Date() })
    public dateEmployment: Date;
}

import { ApiProperty } from '@nestjs/swagger';

import { isDate } from 'class-validator';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @ApiProperty({
        name: 'id',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ name: 'isActive', type: 'boolean', default: true, required: false })
    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @ApiProperty({ name: 'isArchived', type: 'boolean', default: true, required: false })
    @Column({ name: 'is_archived', type: 'boolean', default: false })
    isArchived: boolean;

    @ApiProperty({
        name: 'createDate',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        required: false,
    })
    @CreateDateColumn({
        name: 'create_date',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createDate: Date;

    @ApiProperty({ name: 'deleteDate', type: 'timestamptz' })
    @DeleteDateColumn({ name: 'delete_date', type: 'timestamptz' })
    deleteDate: Date;

    @ApiProperty({
        name: 'lastChangeDate',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    @UpdateDateColumn({
        name: 'last_change_date',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastChangeDate: Date;
}

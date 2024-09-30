import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseCredentials } from './database.credentials';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => DatabaseCredentials,
        }),
    ],
})
export class DatabaseModule {}

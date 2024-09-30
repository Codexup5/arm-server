import { DataSourceOptions } from 'typeorm';

export const DatabaseCredentials: DataSourceOptions = {
    type: 'postgres',
    host: `${process.env.DATABASE_CONNECTION_HOST}`,
    username: `${process.env.DATABASE_CONNECTION_USERNAME}`,
    password: `${process.env.DATABASE_CONNECTION_PASSWORD}`,
    database: `${process.env.DATABASE_CONNECTION_NAME}`,
    entities: [],
    synchronize: true,
    extra: {
        connectionLimit: 5,
    },
};

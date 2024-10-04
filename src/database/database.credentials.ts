import { DataSourceOptions } from 'typeorm';

import { User } from 'models/user/user.model';

export const DatabaseCredentials: DataSourceOptions = {
    type: 'postgres',
    host: `${process.env.DATABASE_CONNECTION_HOST}`,
    username: `${process.env.DATABASE_CONNECTION_USERNAME}`,
    password: `${process.env.DATABASE_CONNECTION_PASSWORD}`,
    database: `${process.env.DATABASE_CONNECTION_NAME}`,
    entities: [User],
    synchronize: true,
    extra: {
        connectionLimit: 5,
    },
};

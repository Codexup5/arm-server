import { DataSourceOptions } from 'typeorm';

import { User } from 'models/user/user.model';
import { Employee } from 'models/employee/employee.model';

export const DatabaseCredentials: DataSourceOptions = {
    type: 'postgres',
    host: `${process.env.DATABASE_CONNECTION_HOST}`,
    username: `${process.env.DATABASE_CONNECTION_USERNAME}`,
    password: `${process.env.DATABASE_CONNECTION_PASSWORD}`,
    database: `${process.env.DATABASE_CONNECTION_NAME}`,
    entities: [User, Employee],
    synchronize: true,
    extra: {
        connectionLimit: 5,
    },
};

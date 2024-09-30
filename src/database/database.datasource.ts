import { DataSource } from 'typeorm';

import { DatabaseCredentials } from './database.credentials';

export const AppDatabase = new DataSource(DatabaseCredentials);

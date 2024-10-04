import { Module } from '@nestjs/common';

import { ConfigurationModule } from 'config/configuration.module';
import { DatabaseModule } from 'database/database.module';
import { UserModule } from 'modules/users.module';

@Module({
    imports: [ConfigurationModule, DatabaseModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}

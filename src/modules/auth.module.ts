import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SwaggerModule } from '@nestjs/swagger';

import { JWT_ENVIRONMENT_VARIABLES } from 'auth/constants';
import { JwtStrategy } from 'auth/strategies/jwt.strategy';
import { LocalStrategy } from 'auth/strategies/local.strategy';

import { ConfigurationModule } from 'config/configuration.module';

import { UserModule } from './users.module';

import { AuthService } from 'services/auth.service';
import { AuthController } from 'controllers/auth.controller';

@Module({
    imports: [
        ConfigurationModule,
        forwardRef(() => UserModule),
        PassportModule,
        SwaggerModule,
        JwtModule.register(JWT_ENVIRONMENT_VARIABLES),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}

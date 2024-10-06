import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_ENVIRONMENT_VARIABLES } from 'auth/constants';

import { USER_NOT_FOUND } from 'common/constants/errors/user.errors';
import { UserPayload } from 'common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_ENVIRONMENT_VARIABLES.secret,
        });
    }

    async validate(payload: UserPayload): Promise<UserPayload> {
        if (payload === null) {
            throw new NotFoundException(USER_NOT_FOUND);
        }

        return payload;
    }
}

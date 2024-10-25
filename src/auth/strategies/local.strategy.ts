import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'models/user/user.model';
import { Strategy } from 'passport-local';
import { AuthService } from 'services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authservice: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<Partial<User>> {
        const user = await this.authservice.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

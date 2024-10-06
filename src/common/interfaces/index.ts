import { Role } from 'models/user/user.enums';

export interface AccessToken {
    accessToken: string;
}

export interface UserPayload {
    id: string;
    role: Role;
    iat?: number;
    exp?: number;
}

export interface RequestWithUser extends Request {
    user: UserPayload;
}
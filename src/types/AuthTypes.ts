export type UserAccessType = 'basic' | 'admin';

export type UserStatusType = 'blocked' | 'active';

export type SignUpRequestBodyType = {
    email: string;
    name: string;
    password: string;
};

export type LoginRequestBodyType = {
    email: string;
    password: string;
    googleData?: { name: string };
}

export type LoginResponseBodyType = {
    id: string;
    name: string;
    access: UserAccessType;
    token: string;
};

export type GithubLoginRequestType = {
    code: string;
};

export type AuthMiddlewareBodyType = {
    tokenPayload: TokenPayloadType;
};

export type AuthCheckResponseBodyType = {
    id: string;
    name: string;
    access: UserAccessType;
};

export type TokenPayloadType = { _id: string; name: string; access: UserAccessType };

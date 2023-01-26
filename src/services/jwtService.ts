import jwt from 'jsonwebtoken';

import { ErrorCode } from '../error-handler/error-code';
import { ErrorException } from '../error-handler/error-exception';
import { UserSchemaType } from "../models/User";
import { TokenPayloadType } from '../types/AuthTypes';

const JWT_KEY = process.env.JWT_SECRET!

export const generateAuthToken = (user: UserSchemaType): string => {
    const { _id, name, access } = user;
    const token = jwt.sign({ _id: _id.toString(), name, access }, JWT_KEY, {
        expiresIn: '7d',
    });

    return token;
};

export const verifyToken = (token: string): TokenPayloadType => {
    try {
        const tokenPayload = jwt.verify(token, JWT_KEY);

        return tokenPayload as TokenPayloadType;
    } catch (error) {
        throw new ErrorException(ErrorCode.Unauthenticated);
    }
};
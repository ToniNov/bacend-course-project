import {NextFunction, Request, Response} from 'express';
import {ErrorCode} from "../error-handler/error-code";
import {ErrorException} from "../error-handler/error-exception";
import {STATUS_CODES} from "../enum/statusCodes";
import {
    AuthCheckResponseBodyType,
    AuthMiddlewareBodyType,
    GithubLoginRequestType,
    LoginRequestBodyType,
    LoginResponseBodyType,
    SignUpRequestBodyType
} from "../types/AuthTypes";
import {
    createUser,
    userWithEmailExists, userWithIdExists,
    userWithNameExists
} from "../services/userService";
import {comparePassword} from "../utils/password-hash";
import {generateAuthToken} from '../services/jwtService';
import {Status} from "../enum/status";
import axios from "axios";


const GITHUB_CLIENT_ID="c127185d72a9a98c58eb"
const GITHUB_SECRET="551d549915e022543aa061f502ed7082d16eb17e"

export const signup = async (
    req: Request<{}, {}, SignUpRequestBodyType>,
    res: Response,
    next: NextFunction
) => {
    const {email, name, password} = req.body;

    const userWithEmail = await userWithEmailExists(email)
    if (userWithEmail) {
        return next(new ErrorException(ErrorCode.DuplicateEmailError, {email}));
    }

    const userWithName = await userWithNameExists(name)
    if (userWithName) {
        return next(new ErrorException(ErrorCode.DuplicateUserNameError, {name}));
    }

    await createUser({name, password, email})

    res.status(STATUS_CODES.CREATED).end();
}

export const login = async (
    req: Request<{}, {}, LoginRequestBodyType>,
    res: Response<LoginResponseBodyType>,
    next: NextFunction,
) => {
    try {
        const {email, password, googleData} = req.body;

        let userWithEmail = await userWithEmailExists(email)

        if (!userWithEmail) {
            if (googleData) {
                const {name} = googleData;
                userWithEmail = await createUser({name, password, email})
            } else {
                return next(new ErrorException(ErrorCode.Unauthenticated));
            }
        }

        if (userWithEmail.status === Status.Block) {
            return next(new ErrorException(ErrorCode.Blocked));
        }

        const validPassword = await comparePassword(password, userWithEmail.password);

        if (!validPassword) {
            return next(new ErrorException(ErrorCode.Unauthenticated));
        }

        const token = generateAuthToken(userWithEmail);

        const userAuthData : LoginResponseBodyType = {
            id: userWithEmail._id.toString(),
            name: userWithEmail.name,
            access: userWithEmail.access,
            token,
        }

        res.send(userAuthData);
    }catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const githubLogin = async (
    req: Request<{}, {}, GithubLoginRequestType>,
    res: Response<LoginResponseBodyType>,
    next: NextFunction,
) => {
    try {
        const {code} = req.body;

        const gitAccessTokenData = await axios.post(
            `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_SECRET}&code=${code}`,
            {},
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        const {data:{email, node_id: password, name}} =
            await axios.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `Bearer ${gitAccessTokenData.data.access_token}`,
                Accept: 'application/json',
            },
        });

        let userWithEmail = await userWithEmailExists(email)

        if (!userWithEmail) {
            userWithEmail = await createUser({name, password, email})
        }

        if (userWithEmail.status === Status.Block) {
            return next(new ErrorException(ErrorCode.Blocked));
        }

        const validPassword = comparePassword(password, userWithEmail.password);

        if (!validPassword) {
            return next(new ErrorException(ErrorCode.Unauthenticated));
        }

        const token = generateAuthToken(userWithEmail);

        const userAuthData : LoginResponseBodyType = {
            id: userWithEmail._id.toString(),
            name: userWithEmail.name,
            access: userWithEmail.access,
            token,
        }

        res.send(userAuthData);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const check = async (
    req: Request<{}, {}, AuthMiddlewareBodyType>,
    res: Response<AuthCheckResponseBodyType>,
    next: NextFunction,
) => {
    const { _id } = req.body.tokenPayload;

    const userExists = await userWithIdExists(_id );

    if (!userExists) {
        return next(new ErrorException(ErrorCode.Unauthenticated));
    }

    res.send({
        id: _id,
        name: userExists.name,
        access: userExists.access,
    });
}
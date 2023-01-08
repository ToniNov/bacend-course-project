"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.githubLogin = exports.login = exports.signup = void 0;
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const statusCodes_1 = require("../enum/statusCodes");
const userService_1 = require("../services/userService");
const password_hash_1 = require("../utils/password-hash");
const jwtService_1 = require("../services/jwtService");
const status_1 = require("../enum/status");
const axios_1 = __importDefault(require("axios"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const userWithEmail = yield (0, userService_1.userWithEmailExists)(email);
    if (userWithEmail) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.DuplicateEmailError, { email }));
    }
    const userWithName = yield (0, userService_1.userWithNameExists)(name);
    if (userWithName) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.DuplicateUserNameError, { name }));
    }
    yield (0, userService_1.createUser)({ name, password, email });
    res.status(statusCodes_1.STATUS_CODES.CREATED).end();
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, googleData } = req.body;
    let userWithEmail = yield (0, userService_1.userWithEmailExists)(email);
    if (!userWithEmail) {
        if (googleData) {
            const { name } = googleData;
            userWithEmail = yield (0, userService_1.createUser)({ name, password, email });
        }
        else {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
        }
    }
    if (userWithEmail.status === status_1.Status.Block) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Blocked));
    }
    const validPassword = (0, password_hash_1.comparePassword)(password, userWithEmail.password);
    if (!validPassword) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
    }
    const token = (0, jwtService_1.generateAuthToken)(userWithEmail);
    res.send({
        id: userWithEmail._id.toString(),
        name: userWithEmail.name,
        access: userWithEmail.access,
        token,
    });
});
exports.login = login;
const githubLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const gitAccessTokenData = yield axios_1.default.post(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${code}`, {}, {
            headers: {
                Accept: 'application/json',
            },
        });
        const { data: { email, node_id: password, name }, } = yield axios_1.default.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `Bearer ${gitAccessTokenData.data.access_token}`,
                Accept: 'application/json',
            },
        });
        let userWithEmail = yield (0, userService_1.userWithEmailExists)(email);
        if (!userWithEmail) {
            userWithEmail = yield (0, userService_1.createUser)({ name, password, email });
        }
        if (userWithEmail.status === status_1.Status.Block) {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Blocked));
        }
        const validPassword = (0, password_hash_1.comparePassword)(password, userWithEmail.password);
        if (!validPassword) {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
        }
        const token = (0, jwtService_1.generateAuthToken)(userWithEmail);
        res.send({
            id: userWithEmail._id.toString(),
            name: userWithEmail.name,
            access: userWithEmail.access,
            token,
        });
    }
    catch (e) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { e }));
    }
});
exports.githubLogin = githubLogin;
const check = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.tokenPayload;
    const userExists = yield (0, userService_1.userWithIdExists)(_id);
    if (!userExists) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
    }
    res.send({
        id: _id,
        name: userExists.name,
        access: userExists.access,
    });
});
exports.check = check;

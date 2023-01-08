"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const secret_1 = require("../enum/secret");
const jwtKey = secret_1.Secret.Secret;
const generateAuthToken = (user) => {
    const { _id, name, access } = user;
    const token = jsonwebtoken_1.default.sign({ _id: _id.toString(), name, access }, jwtKey, {
        expiresIn: '7d',
    });
    return token;
};
exports.generateAuthToken = generateAuthToken;
const verifyToken = (token) => {
    try {
        const tokenPayload = jsonwebtoken_1.default.verify(token, jwtKey);
        return tokenPayload;
    }
    catch (error) {
        throw new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated);
    }
};
exports.verifyToken = verifyToken;

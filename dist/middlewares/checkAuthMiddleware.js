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
exports.checkAuthMiddleware = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const jwtService_1 = require("../services/jwtService");
const User_1 = require("../models/User");
const TOKEN_START_INDEX = 7;
const checkAuthMiddleware = (withAccessControl = false) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const auth = req.headers.authorization;
        if (auth && auth.startsWith('Bearer')) {
            const token = auth.slice(TOKEN_START_INDEX);
            try {
                const tokenPayload = (0, jwtService_1.verifyToken)(token);
                const { _id } = tokenPayload;
                const userExists = yield User_1.UserModel.findOne({
                    _id: new mongoose_1.default.Types.ObjectId(_id),
                });
                if (!userExists) {
                    return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
                }
                if (userExists.status === 'blocked') {
                    return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Blocked));
                }
                if (withAccessControl && userExists.access === 'basic') {
                    return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotAllowed));
                }
                req.body.tokenPayload = tokenPayload;
                next();
            }
            catch (error) {
                return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
            }
        }
        else {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
        }
    });
};
exports.checkAuthMiddleware = checkAuthMiddleware;

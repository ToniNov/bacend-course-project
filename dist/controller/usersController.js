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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserName = exports.deleteUsers = exports.updateUsers = exports.getUsers = void 0;
const User_1 = require("../models/User");
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const statusCodes_1 = require("../enum/statusCodes");
const DEFAULT_PAGE_LIMIT = 5;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page = 1, limit = DEFAULT_PAGE_LIMIT } = req.query;
        page = Number(page);
        limit = Number(limit);
        const users = yield User_1.UserModel.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
        const count = yield User_1.UserModel.countDocuments();
        const mappedUsers = users.map(({ _id, name, email, status, access }) => ({
            id: _id.toString(),
            name,
            email,
            status,
            access,
        }));
        res.send({ users: mappedUsers, count });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getUsers = getUsers;
const updateUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds, update } = req.body;
        yield User_1.UserModel.updateMany({ _id: { $in: userIds } }, { $set: update });
        const changedUsers = yield User_1.UserModel.find({ _id: { $in: userIds } });
        const users = changedUsers.map(({ _id, name, email, status, access }) => ({
            id: _id.toString(),
            name,
            email,
            status,
            access,
        }));
        res.send({ users });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.updateUsers = updateUsers;
const deleteUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.UserModel.deleteMany({ _id: { $in: req.body.userIds } });
        res.status(statusCodes_1.STATUS_CODES.OK).end();
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.deleteUsers = deleteUsers;
const getUserName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userDb = yield User_1.UserModel.findOne({ _id: id });
        if (!userDb)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        res.send({ name: userDb.name });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getUserName = getUserName;

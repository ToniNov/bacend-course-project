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
exports.ownerExists = exports.createUser = exports.userWithIdExists = exports.userWithNameExists = exports.userWithEmailExists = void 0;
const status_1 = require("../enum/status");
const access_1 = require("../enum/access");
const password_hash_1 = require("../utils/password-hash");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const userWithEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.UserModel.findOne({ email });
    }
    catch (error) {
        throw new Error();
    }
});
exports.userWithEmailExists = userWithEmailExists;
const userWithNameExists = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.UserModel.findOne({ name });
    }
    catch (error) {
        throw new Error();
    }
});
exports.userWithNameExists = userWithNameExists;
const userWithIdExists = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.UserModel.findOne({ _id });
    }
    catch (error) {
        throw new Error();
    }
});
exports.userWithIdExists = userWithIdExists;
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = payload;
        const status = status_1.Status.Active;
        const access = access_1.Access.Basic;
        const hashedPassword = (0, password_hash_1.passwordHash)(password);
        const userNew = {
            _id: new mongoose_1.default.Types.ObjectId(),
            name,
            email,
            status,
            access,
            password: hashedPassword,
        };
        return yield User_1.UserModel.create(userNew);
    }
    catch (error) {
        throw new Error('Err with creating user');
    }
});
exports.createUser = createUser;
const ownerExists = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.UserModel.findOne({ _id: owner });
    }
    catch (error) {
        throw new Error();
    }
});
exports.ownerExists = ownerExists;

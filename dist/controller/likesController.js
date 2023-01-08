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
exports.deleteLike = exports.createLike = exports.getItemLikes = void 0;
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const mongoose_1 = __importDefault(require("mongoose"));
const like_1 = __importDefault(require("../models/like"));
const likeService_1 = require("../services/likeService");
const getItemLikes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const likes = yield (0, likeService_1.findLikes)(id);
        const users = likes.map(like => like.user._id.toString());
        res.send({ users });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getItemLikes = getItemLikes;
const createLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item, user } = req.body;
        const like = yield (0, likeService_1.createNewLike)(item, user);
        if (!like)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        const likeRes = {
            id: like.id,
            item: like.item._id.toString(),
            user: like.user._id.toString(),
        };
        res.send(likeRes);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.createLike = createLike;
const deleteLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item, user } = req.body;
        yield like_1.default.deleteOne({
            item: new mongoose_1.default.Types.ObjectId(item),
            user: new mongoose_1.default.Types.ObjectId(user),
        });
        res.send({ deleted: true });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.deleteLike = deleteLike;

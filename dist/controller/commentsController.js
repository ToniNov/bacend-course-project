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
exports.getComments = exports.createComment = void 0;
const error_code_1 = require("../error-handler/error-code");
const error_exception_1 = require("../error-handler/error-exception");
const Comment_1 = __importDefault(require("../models/Comment"));
const commentService_1 = require("../services/commentService");
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item, message, user } = req.body;
        const newComment = yield (0, commentService_1.createNewComment)(item, user, message);
        const commentExists = yield Comment_1.default.findById(newComment._id).populate('user');
        if (!commentExists)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        const commentData = {
            id: commentExists._id.toString(),
            item: commentExists.item.toString(),
            user: {
                id: commentExists.user._id.toString(),
                name: commentExists.user.name,
            },
            message: commentExists.message,
            date: commentExists.createdAt.toString(),
        };
        res.send(commentData);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.createComment = createComment;
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comments = yield (0, commentService_1.findAndPopulate)(id);
        const commentsRes = comments.map(comment => ({
            id: comment._id.toString(),
            item: comment.item.toString(),
            message: comment.message,
            user: { id: comment.user._id.toString(), name: comment.user.name },
            date: comment.createdAt.toString(),
        }));
        res.send(commentsRes);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getComments = getComments;

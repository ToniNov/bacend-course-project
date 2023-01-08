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
exports.findAndPopulate = exports.createNewComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Comment_1 = __importDefault(require("../models/Comment"));
const createNewComment = (item, user, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newComment = {
            _id: new mongoose_1.default.Types.ObjectId(),
            message,
            item: new mongoose_1.default.Types.ObjectId(item),
            user: new mongoose_1.default.Types.ObjectId(user),
        };
        return yield Comment_1.default.create(newComment);
    }
    catch (error) {
        throw new Error();
    }
});
exports.createNewComment = createNewComment;
const findAndPopulate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Comment_1.default.find({ item: id }).populate('user');
    }
    catch (error) {
        throw new Error();
    }
});
exports.findAndPopulate = findAndPopulate;

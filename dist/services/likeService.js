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
exports.createNewLike = exports.findLikes = void 0;
const like_1 = __importDefault(require("../models/like"));
const mongoose_1 = __importDefault(require("mongoose"));
const findLikes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield like_1.default.find({ item: id });
    }
    catch (error) {
        throw new Error();
    }
});
exports.findLikes = findLikes;
const createNewLike = (item, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLike = {
            _id: new mongoose_1.default.Types.ObjectId(),
            item: new mongoose_1.default.Types.ObjectId(item),
            user: new mongoose_1.default.Types.ObjectId(user),
        };
        return yield like_1.default.create(newLike);
    }
    catch (error) {
        throw new Error();
    }
});
exports.createNewLike = createNewLike;

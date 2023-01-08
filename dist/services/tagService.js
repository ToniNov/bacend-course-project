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
exports.findAndCreateTagId = exports.findTag = void 0;
const Tag_1 = __importDefault(require("../models/Tag"));
const mongoose_1 = __importDefault(require("mongoose"));
const findTag = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Tag_1.default.findOne({ title: tag });
    }
    catch (error) {
        throw new Error();
    }
});
exports.findTag = findTag;
const findAndCreateTagId = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Promise.all(tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
            const tagDb = yield Tag_1.default.findOne({ title: tag });
            if (tagDb)
                return tagDb._id;
            const newTag = yield Tag_1.default.create({
                _id: new mongoose_1.default.Types.ObjectId(),
                title: tag,
            });
            return newTag._id;
        })));
    }
    catch (error) {
        throw new Error();
    }
});
exports.findAndCreateTagId = findAndCreateTagId;

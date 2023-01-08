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
exports.getTags = void 0;
const error_exception_1 = require("../error-handler/error-exception");
const error_code_1 = require("../error-handler/error-code");
const Item_1 = __importDefault(require("../models/Item"));
const Tag_1 = __importDefault(require("../models/Tag"));
const getTags = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagsDb = yield Tag_1.default.find({});
        const tags = yield Promise.all(tagsDb.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                value: tag.title,
                count: yield Item_1.default.find({ tags: tag._id }).count(),
            });
        })));
        res.send(tags);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getTags = getTags;

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
exports.getTopics = void 0;
const Topic_1 = __importDefault(require("../models/Topic"));
const error_exception_1 = require("../error-handler/error-exception");
const error_code_1 = require("../error-handler/error-code");
const getTopics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("rend");
        const topics = yield Topic_1.default.find();
        const topicTitles = topics.map(topic => topic.title);
        res.send(topicTitles);
    }
    catch (error) {
        console.log("err");
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getTopics = getTopics;

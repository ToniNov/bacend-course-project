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
exports.findTopic = exports.createTopicIds = void 0;
const Topic_1 = __importDefault(require("../models/Topic"));
const mongoose_1 = __importDefault(require("mongoose"));
const createTopicIds = (topics) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topicsDb = yield Topic_1.default.find({ title: { $in: topics } });
        const topicsDbObjectIds = topicsDb.map(topic => new mongoose_1.default.Types.ObjectId(topic._id));
        return yield topicsDbObjectIds;
    }
    catch (error) {
        throw new Error();
    }
});
exports.createTopicIds = createTopicIds;
const findTopic = (topics) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Topic_1.default.find({ title: { $in: topics } });
    }
    catch (error) {
        throw new Error();
    }
});
exports.findTopic = findTopic;

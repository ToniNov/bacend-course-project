"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const collection_1 = __importDefault(require("./collection"));
const topicController_1 = require("../controller/topicController");
const topicsRouter = express_1.default.Router();
collection_1.default.get(path_1.Path.Root, topicController_1.getTopics);
exports.default = topicsRouter;

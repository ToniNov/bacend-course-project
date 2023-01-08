"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const index_1 = require("../controller/index");
const TagRouter = express_1.default.Router();
TagRouter.get(path_1.Path.Root, index_1.TagController.getTags);
exports.default = TagRouter;

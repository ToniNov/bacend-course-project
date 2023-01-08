"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const index_1 = require("../controller/index");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const commentRouter = express_1.default.Router();
commentRouter.get(path_1.Path.Id, index_1.CommentsController.getComments);
commentRouter.post(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.CommentsController.createComment);
exports.default = commentRouter;

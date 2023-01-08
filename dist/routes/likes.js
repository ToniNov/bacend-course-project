"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const index_1 = require("../controller/index");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const likesRouter = express_1.default.Router();
likesRouter.get(path_1.Path.Id, index_1.LikesController.getItemLikes);
likesRouter.post(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.LikesController.createLike);
likesRouter.delete(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.LikesController.deleteLike);
exports.default = likesRouter;

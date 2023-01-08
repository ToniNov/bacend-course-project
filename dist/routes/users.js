"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const index_1 = require("../controller/index");
const usersRouter = express_1.default.Router();
usersRouter.get(path_1.Path.Id, index_1.UsersController.getUserName);
usersRouter.get(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(true), index_1.UsersController.getUsers);
usersRouter.delete(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(true), index_1.UsersController.deleteUsers);
usersRouter.put(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(true), index_1.UsersController.updateUsers);
exports.default = usersRouter;

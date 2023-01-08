"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const index_1 = require("../controller/index");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const authorizationRouter = express_1.default.Router();
authorizationRouter.post(path_1.Path.Signup, index_1.AuthorizationController.signup);
authorizationRouter.post(path_1.Path.Login, index_1.AuthorizationController.login);
authorizationRouter.get(path_1.Path.Check, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.AuthorizationController.check);
authorizationRouter.post(path_1.Path.GithubLogin, index_1.AuthorizationController.githubLogin);
exports.default = authorizationRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const controller_1 = require("../controller");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const collectionRouter = express_1.default.Router();
collectionRouter.get(path_1.Path.Popular, controller_1.CollectionController.getPopularCollection);
collectionRouter.get(path_1.Path.Id, controller_1.CollectionController.getCollection);
collectionRouter.patch(path_1.Path.Id, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), controller_1.CollectionController.updateCollection);
collectionRouter.delete(path_1.Path.Id, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), controller_1.CollectionController.deleteCollection);
collectionRouter.get(`${path_1.Path.User + path_1.Path.Id}`, controller_1.CollectionController.getUserCollections);
collectionRouter.post(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), controller_1.CollectionController.createCollection);
exports.default = collectionRouter;

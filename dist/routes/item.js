"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("../enum/path");
const checkAuthMiddleware_1 = require("../middlewares/checkAuthMiddleware");
const index_1 = require("../controller/index");
const itemRouter = express_1.default.Router();
itemRouter.get(path_1.Path.Root, index_1.ItemController.getLatestTenItems);
itemRouter.get(path_1.Path.Id, index_1.ItemController.getItem);
itemRouter.post(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.ItemController.createItem);
itemRouter.patch(path_1.Path.Id, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.ItemController.updateItem);
itemRouter.delete(path_1.Path.Root, (0, checkAuthMiddleware_1.checkAuthMiddleware)(), index_1.ItemController.deleteItems);
itemRouter.get(`${path_1.Path.Collection + path_1.Path.Id}`, index_1.ItemController.getCollectionItems);
itemRouter.get(`${path_1.Path.Tags + path_1.Path.Tag}`, index_1.ItemController.getItemsByTag);
exports.default = itemRouter;

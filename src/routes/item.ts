import express from "express";
import {Path} from "../enum/path";
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";
import {ItemController} from "../controller/index"

const itemRouter = express.Router()

itemRouter.get(Path.Root, ItemController.getLatestTenItems);
itemRouter.get(Path.Id, ItemController.getItem);
itemRouter.post(Path.Root, checkAuthMiddleware(), ItemController.createItem);
itemRouter.patch(Path.Id, checkAuthMiddleware(), ItemController.updateItem);
itemRouter.delete(Path.Root, checkAuthMiddleware(), ItemController.deleteItems);
itemRouter.get(`${Path.Collection + Path.Id}`, ItemController.getCollectionItems);

itemRouter.get(`${Path.Tags + Path.Tag}`, ItemController.getItemsByTag);

export default itemRouter
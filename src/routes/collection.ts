import express from "express";
import {Path} from "../enum/path";
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";
import {CollectionController} from "../controller/index"
import { getPopularCollection } from "../controller/collectionController";

const collectionRouter = express.Router()

collectionRouter.get(Path.Id, CollectionController.getCollection);
collectionRouter.patch(Path.Id, checkAuthMiddleware(), CollectionController.updateCollection);
collectionRouter.delete(Path.Id, checkAuthMiddleware(), CollectionController.deleteCollection);
collectionRouter.get(`${Path.User + Path.Id}`, CollectionController.getUserCollections);
collectionRouter.post(Path.Root, checkAuthMiddleware(), CollectionController.createCollection);
collectionRouter.get(Path.Popular, getPopularCollection);

export default collectionRouter
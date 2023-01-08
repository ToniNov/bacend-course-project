import express from "express";
import {Path} from "../enum/path";
import {CollectionController} from "../controller"
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";

const collectionRouter = express.Router()

collectionRouter.get(Path.Popular, CollectionController.getPopularCollection);
collectionRouter.get(Path.Id, CollectionController.getCollection);
collectionRouter.patch(Path.Id, checkAuthMiddleware(), CollectionController.updateCollection);
collectionRouter.delete(Path.Id, checkAuthMiddleware(), CollectionController.deleteCollection);
collectionRouter.get(`${Path.User + Path.Id}`, CollectionController.getUserCollections);
collectionRouter.post(Path.Root, checkAuthMiddleware(), CollectionController.createCollection);

export default collectionRouter
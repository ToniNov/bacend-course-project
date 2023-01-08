import express from "express";
import {Path} from "../enum/path";
import {LikesController} from "../controller/index"
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";

const likesRouter = express.Router()

likesRouter.get(Path.Id, LikesController.getItemLikes);
likesRouter.post(Path.Root, checkAuthMiddleware(), LikesController.createLike);
likesRouter.delete(Path.Root, checkAuthMiddleware(), LikesController.deleteLike);

export default likesRouter
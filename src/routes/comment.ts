import express from "express";
import {Path} from "../enum/path";
import {CommentsController} from "../controller/index"
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";

const commentRouter = express.Router()

commentRouter.get(Path.Id, CommentsController.getComments);
commentRouter.post(Path.Root, checkAuthMiddleware(), CommentsController.createComment);

export default commentRouter
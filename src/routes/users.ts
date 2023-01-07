import express from "express";
import {Path} from "../enum/path";
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";
import {UsersController} from "../controller/index"

const usersRouter = express.Router()

usersRouter.get(Path.Id, UsersController.getUserName);
usersRouter.get(Path.Root, checkAuthMiddleware(true), UsersController.getUsers);
usersRouter.delete(Path.Root, checkAuthMiddleware(true), UsersController.deleteUsers);
usersRouter.put(Path.Root, checkAuthMiddleware(true), UsersController.updateUsers);

export default usersRouter

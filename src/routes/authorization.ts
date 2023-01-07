import express from "express";
import {Path} from "../enum/path";
import {AuthorizationController} from "../controller/index"
import {checkAuthMiddleware} from "../middlewares/checkAuthMiddleware";

const authorizationRouter = express.Router()

authorizationRouter.post(Path.Signup,  AuthorizationController.signup)
authorizationRouter.post(Path.Login, AuthorizationController.login)
authorizationRouter.get(Path.Check, checkAuthMiddleware(), AuthorizationController.check)
authorizationRouter.post(Path.GithubLogin, AuthorizationController.githubLogin )

export default authorizationRouter
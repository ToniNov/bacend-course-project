import express from "express";
import {Path} from "../enum/path";
import {getTopics} from "../controller/topicController";

const topicsRouter = express.Router()

topicsRouter.get(Path.Root, getTopics)

export default topicsRouter
import express from "express";
import {Path} from "../enum/path";
import collectionRouter from "./collection";
import {getTopics} from "../controller/topicController";

const topicsRouter = express.Router()

collectionRouter.get(Path.Root, getTopics)

export default topicsRouter
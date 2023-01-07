import express from "express";
import {Path} from "../enum/path";
import {TagController} from "../controller/index"

const TagRouter = express.Router()

TagRouter.get(Path.Root, TagController.getTags);

export default TagRouter
import express from "express";
import {Path} from "../enum/path";
import collectionRouter from "./collection";
import {searchByQuery} from "../controller/searchController";

const searchRouter = express.Router()

collectionRouter.get(Path.Root, searchByQuery)

export default searchRouter
import { GetTagsResponse } from "../types/TagsTypes";
import {NextFunction, Request, Response} from "express";
import {ErrorException} from "../error-handler/error-exception";
import {ErrorCode} from "../error-handler/error-code";
import ItemModel from "../models/Item";
import TagModel from "../models/Tag";

export  const getTags =  async (req: Request, res: Response<GetTagsResponse>, next: NextFunction) => {
    try {
        const tagsDb = await TagModel.find({});
        const tags = await Promise.all(
            tagsDb.map(async tag => ({
                value: tag.title,
                count: await ItemModel.find({ tags: tag._id }).count(),
            })),
        );

        res.send(tags);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, { error }));
    }
}
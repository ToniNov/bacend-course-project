import {GetTopicsResponseType} from "../types/CollectionTypes";
import {NextFunction, Request, Response} from "express";
import TopicModel from "../models/Topic";
import { ErrorException } from "../error-handler/error-exception";
import { ErrorCode } from "../error-handler/error-code";

export const getTopics = async (
    req: Request,
    res: Response<GetTopicsResponseType>,
    next: NextFunction,
) => {
    try {
        console.log("rend")
        const topics = await TopicModel.find();

        const topicTitles = topics.map(topic => topic.title);

        res.send(topicTitles);
    } catch (error) {
        console.log("err")
        return next(new ErrorException(ErrorCode.UnknownError, { error }));
    }
}
import {NextFunction, Request, Response} from "express";
import {ErrorCode} from "../error-handler/error-code";
import {ErrorException} from "../error-handler/error-exception";
import mongoose from "mongoose";
import LikeModel from "../models/like";
import {
    CreateLikeRequestType,
    DeleteLikeRequestType,
    DeleteLikeResponseType, GetItemLikesRequestType, GetItemLikesResponseType,
    LikeType
} from "../types/LikeTypes";
import {createNewLike, findLikes} from "../services/likeService";

export const getItemLikes = async (
    req: Request<GetItemLikesRequestType>,
    res: Response<GetItemLikesResponseType>,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;

        const likes = await findLikes(id)

        const users = likes.map(like => like.user._id.toString());

        res.send({users});
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const createLike = async (
    req: Request<{}, {}, CreateLikeRequestType>,
    res: Response<LikeType>,
    next: NextFunction,
) => {
    try {
        const {item, user} = req.body;

        const like = await createNewLike(item, user)

        if (!like) return next(new ErrorException(ErrorCode.UnknownError));

        const likeRes: LikeType = {
            id: like.id,
            item: like.item._id.toString(),
            user: like.user._id.toString(),
        };

        res.send(likeRes);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const deleteLike = async (
    req: Request<{}, {}, DeleteLikeRequestType>,
    res: Response<DeleteLikeResponseType>,
    next: NextFunction,
) => {
    try {
        const {item, user} = req.body;

        await LikeModel.deleteOne({
            item: new mongoose.Types.ObjectId(item),
            user: new mongoose.Types.ObjectId(user),
        });

        res.send({deleted: true});
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}
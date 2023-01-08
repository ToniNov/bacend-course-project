import { NextFunction, Request, Response } from 'express';


import {ErrorCode} from "../error-handler/error-code";
import {ErrorException} from '../error-handler/error-exception';
import {CommentResponseType, CreateCommentRequestType} from "../types/CommentsType";
import CommentModel, {CommentSchemaType} from "../models/Comment";
import {UserSchemaType} from "../models/User";
import {createNewComment, findAndPopulate} from "../services/commentService";

export const createComment = async (
        req: Request<{}, {}, CreateCommentRequestType>,
        res: Response<CommentResponseType>,
        next: NextFunction,
    ) => {
        try {
            const { item, message, user } = req.body;

            const newComment = await createNewComment(item, user, message)

            const commentExists = await CommentModel.findById(newComment._id).populate<{
                user: UserSchemaType;
            }>('user');

            if (!commentExists) return next(new ErrorException(ErrorCode.NotFound));

            const commentData: CommentResponseType = {
                id: commentExists._id.toString(),
                item: commentExists.item.toString(),
                user: {
                    id: commentExists.user._id.toString(),
                    name: commentExists.user.name,
                },
                message: commentExists.message,
                date: commentExists.createdAt!.toString(),
            };

            res.send(commentData);
        } catch (error) {
            return next(new ErrorException(ErrorCode.UnknownError, { error }));
        }
    }
export const  getComments = async (
        req: Request<{ id: string }>,
        res: Response<CommentResponseType[]>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;

            const comments = await findAndPopulate(id)

            const commentsRes: CommentResponseType[] = comments.map(comment => ({
                id: comment._id.toString(),
                item: comment.item.toString(),
                message: comment.message,
                user: { id: comment.user._id.toString(), name: comment.user.name },
                date: comment.createdAt!.toString(),
            }));

            res.send(commentsRes);
        } catch (error) {
            return next(new ErrorException(ErrorCode.UnknownError, { error }));
        }
    }

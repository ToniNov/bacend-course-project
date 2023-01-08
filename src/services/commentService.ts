import LikeModel, {LikeSchemaType} from "../models/like";
import mongoose from "mongoose";
import CommentModel, {CommentSchemaType} from "../models/Comment";
import {UserSchemaType} from "../models/User";

export const createNewComment =
    async (item: string, user: string, message: string) => {
        try {
            const newComment: CommentSchemaType = {
                _id:  new mongoose.Types.ObjectId(),
                message,
                item: new mongoose.Types.ObjectId(item),
                user: new mongoose.Types.ObjectId(user),
            };

            return await CommentModel.create(newComment);
        } catch (error) {
            throw new Error()
        }
    };

export const findAndPopulate = async (id: string) => {
    try {
        return await CommentModel.find({ item: id }).populate<{
            user: UserSchemaType;
        }>('user');
    } catch (error) {
        throw new Error()
    }
};


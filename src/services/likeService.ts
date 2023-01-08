import LikeModel, {LikeSchemaType} from "../models/like";
import mongoose from "mongoose";

export const findLikes = async (id: string) => {
    try {
        return await LikeModel.find({item: id});
    } catch (error) {
        throw new Error()
    }
};

export const createNewLike = async (item: string, user: string) => {
    try {

        const newLike: LikeSchemaType = {
            _id: new mongoose.Types.ObjectId(),
            item: new mongoose.Types.ObjectId(item),
            user: new mongoose.Types.ObjectId(user),
        };

        return await LikeModel.create(newLike);

    } catch (error) {
        throw new Error()
    }
};


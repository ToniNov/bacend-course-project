import TagModel from "../models/Tag";
import mongoose from "mongoose";

export const findTag = async (tag: string) => {
    try {
        return await TagModel.findOne({ title: tag });

    } catch (error) {
        throw new Error()
    }
};


export const findAndCreateTagId = async (tags: string[]) => {
    try {
        return await Promise.all(
            tags.map( async tag => {
                const tagDb = await TagModel.findOne({title: tag});

                if (tagDb) return tagDb._id;
                const newTag = await TagModel.create({
                    _id: new mongoose.Types.ObjectId(),
                    title: tag,
                });

                return newTag._id;
            }))
    } catch (error) {
        throw new Error()
    }
};


import TopicModel from "../models/Topic";
import mongoose from "mongoose";

export const createTopicIds = async (topics: string[])=> {
    try {
        const topicsDb = await TopicModel.find({ title: { $in: topics } })

        const topicsDbObjectIds = topicsDb.map(
            topic => new mongoose.Types.ObjectId(topic._id),
        )

        return await topicsDbObjectIds
    } catch (error) {
        throw new Error()
    }
}

export const findTopic = async (topics: string[])=> {
    try {
        return await TopicModel.find({ title: { $in: topics } })
    } catch (error) {
        throw new Error()
    }
}



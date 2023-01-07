import {CollectionModel, CollectionSchemaType, FieldType} from "../models/Collection";
import mongoose from "mongoose";
import {TopicSchemaType} from "../models/Topic";
import {UserSchemaType} from "../models/User";
import {dbPayloadType} from "../types/CollectionTypes";

export const collectionWithNameExists = async (title: string) => {
    try {
        return await CollectionModel.findOne({ title });
    } catch (error) {
        throw new Error()
    }
}

export const createNewCollection
    = async (_id: mongoose.Types.ObjectId,
             title: string,
             description: string,
             owner: mongoose.Types.ObjectId,
             topics: mongoose.Types.ObjectId[],
             itemFields: FieldType[],
             image: string | null) => {
    try {

        const newCollection: CollectionSchemaType = {
            _id: _id,
            title,
            description,
            owner: owner,
            topics: topics,
            itemFields,
            image,
        };

        return await CollectionModel.create(newCollection)
    } catch (error) {
        throw new Error()
    }
}

export const createdCollectionExists = async (_id: mongoose.Types.ObjectId) => {
    try {
        return await CollectionModel.findOne({_id: _id})
            .populate<{ topics: TopicSchemaType[] }>('topics')
            .populate<{ owner: UserSchemaType}>('owner');
    } catch (error) {
        throw new Error()
    }
}

export const userCollectionExists = async (id: string) => {
    try {
        return await CollectionModel.findOne({_id: id,})
            .populate<{ topics: TopicSchemaType[]; }>('topics')
            .populate<{ owner: UserSchemaType; }>('owner');
    } catch (error) {
        throw new Error()
    }
}

export const refreshCollection = async (id: string , dbP: dbPayloadType ) => {
    try {
        return await CollectionModel.findByIdAndUpdate(id , dbP, {lean: true, new: true})
    } catch (error) {
        console.log(error)
        throw new Error()
    }
}
export const removeCollection = async (id: string) => {
    try {
        return await CollectionModel.deleteMany({ _id: { $in: [id] } })
    } catch (error) {
        throw new Error()
    }
}

export const getAllUserCollection = async (id: string) => {
    try {
        const userCollectionsDb = await CollectionModel.find({owner: id})
            .populate<{ topics: TopicSchemaType[] }>('topics')
            .populate<{ owner: UserSchemaType }>('owner')

        const userCollections = userCollectionsDb.map(
            ({ _id, title, description, image, owner, topics, itemFields }) => ({
                id: _id.toString(),
                title,
                description,
                image: image || null,
                owner: { id: owner._id.toString(), name: owner.name },
                topics: topics.map(topic => topic.title),
                itemFields,
            }),
        );

        return await userCollections
    } catch (error) {
        throw new Error()
    }
}




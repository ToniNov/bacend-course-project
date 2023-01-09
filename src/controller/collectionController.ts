import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import {
    CollectionResponseType,
    CreateCollectionRequestType,
    CreateCollectionResponseType,
    DeleteCollectionRequestType,
    GetUserCollectionsResponseType,
    UpdateCollectionRequestBodyType,
    UpdateCollectionRequestParamType
} from "../types/CollectionTypes";
import {ErrorException} from "../error-handler/error-exception";
import {ErrorCode} from "../error-handler/error-code";
import {
    collectionWithNameExists,
    createdCollectionExists,
    createNewCollection,
    getAllUserCollection,
    refreshCollection,
    removeCollection,
    userCollectionExists
} from "../services/collectionService";
import {ownerExists} from "../services/userService";
import {createTopicIds, findTopic} from "../services/topicSrevice";
import {TopicSchemaType} from "../models/Topic";
import {STATUS_CODES} from "../enum/statusCodes";
import {UserSchemaType} from "../models/User";
import { CollectionModel } from "../models/Collection";
import ItemModel from "../models/Item";

export const createCollection = async (
    req: Request<{}, {}, CreateCollectionRequestType>,
    res: Response<CreateCollectionResponseType>,
    next: NextFunction,
) => {
    try {
        const {description, image, itemFields, owner, title, topics} = req.body;

        const collectionWithName = await collectionWithNameExists(title);

        if (collectionWithName) {
            return next(
                new ErrorException(ErrorCode.DuplicateCollectionTitleError, {title}),
            );
        }

        const isOwner = await ownerExists(owner)

        if (!isOwner) {
            return next(new ErrorException(ErrorCode.OwnerNotFound, {owner}));
        }

        const topicsDbObjectIds = await createTopicIds(topics)
        const newCollectionObjectId = new mongoose.Types.ObjectId();

        await createNewCollection(
            newCollectionObjectId,
            title,
            description,
            isOwner._id,
            topicsDbObjectIds,
            itemFields,
            image
        )

        const collectionCreated = await createdCollectionExists(newCollectionObjectId)

        if (!collectionCreated)
            return next(new ErrorException(ErrorCode.UnknownError));

        const createdCollection: CreateCollectionResponseType = {
            id: collectionCreated._id.toString(),
            title: collectionCreated.title,
            description: collectionCreated.description,
            image: collectionCreated.image || null,
            owner: {
                id: collectionCreated.owner._id.toString(),
                name: collectionCreated.owner.name,
            },
            topics: collectionCreated.topics.map((topic: TopicSchemaType) => topic.title),
            itemFields: collectionCreated.itemFields,
        };

        res.send(createdCollection);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const getCollection = async (
    req: Request<{ id: string }>,
    res: Response<CollectionResponseType>,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;

        const userCollection = await userCollectionExists(id)

        if (!userCollection) return next(new ErrorException(ErrorCode.NotFound));

        const {_id, title, description, image, owner, topics, itemFields} =
            userCollection;

        const collection = {
            id: _id.toString(),
            title,
            description,
            image: image || null,
            owner: {id: owner._id.toString(), name: owner.name},
            topics: topics.map(topic => topic.title),
            itemFields: itemFields.map(({title, type}) => ({title, type})),
        };


        res.send(collection);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const getUserCollections = async (
    req: Request<{ id: string }>,
    res: Response<GetUserCollectionsResponseType>,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const userCollections = await getAllUserCollection(id)

        res.send(userCollections);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, { error }));
    }
}

export const updateCollection = async (
    req: Request<UpdateCollectionRequestParamType, {}, UpdateCollectionRequestBodyType>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const { title, description, image, topics, itemFields } = req.body;

        const dbPayload = { title, description, itemFields, image };

        const topicsDb = await findTopic(topics);

        const dbP = Object.assign(dbPayload, { topics: topicsDb });

        const updatedCollection = await refreshCollection(id, dbP)

        res.send(updatedCollection);
    } catch (error) {
        next(new ErrorException(ErrorCode.UnknownError, { error }));
    }
}

export const deleteCollection = async (
    req: Request<DeleteCollectionRequestType>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        await removeCollection(id)

        res.status(STATUS_CODES.OK).end();
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError ,{ error }));
    }
}

export const getPopularCollection = async (
    req: Request,
    res: Response<GetUserCollectionsResponseType>,
    next: NextFunction,
) => {
    try {
        const COLLECTIONS_COUNT = 5;

        const collectionsDb = await CollectionModel.find({})
            .populate<{
                topics: TopicSchemaType[];
            }>('topics')
            .populate<{
                owner: UserSchemaType;
            }>('owner');

        const collectionItemCount = await Promise.all(
            collectionsDb.map(async ({ id }) => ({
                id,
                count: await (await ItemModel.find({ collections: id })).length,
            })),
        );

        collectionItemCount.sort((a, b) => b.count - a.count);

        const biggestCollectionsIds = collectionItemCount
            .splice(0, COLLECTIONS_COUNT)
            .map(colleciton => colleciton.id);

        const fiveCollections: GetUserCollectionsResponseType = collectionsDb
            .filter(({ id }) => biggestCollectionsIds.includes(id))
            .map(({ id, description, image, owner, title, itemFields, topics }) => ({
                id,
                description,
                image,
                owner: { id: owner._id.toString(), name: owner.name },
                title,
                itemFields,
                topics: topics.map(topic => topic.title),
            }));

        res.send(fiveCollections);
    } catch (e) {
        return next(new ErrorException(ErrorCode.UnknownError, { e }));
    }
}

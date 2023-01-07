import mongoose from "mongoose";
import {NextFunction, Request, Response} from 'express';
import {
    CreateItemRequestType,
    CreateItemResponseType,
    DeleteItemsRequestType,
    GetCollectionItemsRequestQueryType, GetCollectionItemsResponseType,
    GetItemsByTagResponse,
    GetTenLatestResponse,
    ItemType,
    UpdateItemRequestBodyType
} from "../types/ItemTypes";
import ItemModel, {ItemSchemaType} from "../models/Item";
import {ErrorException} from "../error-handler/error-exception";
import {ErrorCode} from "../error-handler/error-code";
import TagModel, {TagSchemaType} from "../models/Tag";
import {findAndCreateTagId, findTag} from "../services/tagService";
import {CollectionSchemaType} from "../models/Collection";
import {
    countCollection,
    countItem,
    findByLimit,
    findItemById, findLatestTenItems,
    findLimitCollection
} from "../services/itemService";


const DEFAULT_PAGE_LIMIT = 5;

export const createItem = async (
    req: Request<{}, {}, CreateItemRequestType>,
    res: Response<CreateItemResponseType>,
    next: NextFunction,
) => {
    try {
        const {title, tags, itemFields, collection} = req.body.item;

        const tagsDbObjectIds = await findAndCreateTagId(tags)

        const itemObjectId = new mongoose.Types.ObjectId();
        const collectionObjectId = new mongoose.Types.ObjectId(collection);
        const newItem: ItemSchemaType = {
            _id: itemObjectId,
            title,
            tags: tagsDbObjectIds,
            collections: collectionObjectId,
            itemFields,
        };

        const createdItemDb = await (
            await ItemModel.create(newItem)
        ).populate<{ tags: TagSchemaType[] }>('tags');

        if (!createdItemDb) return next(new ErrorException(ErrorCode.UnknownError));
        const createdItem: CreateItemResponseType = {
            id: createdItemDb._id.toString(),
            title: createdItemDb.title,
            collection: createdItemDb.collections._id.toString(),
            itemFields: createdItemDb.itemFields,
            tags: createdItemDb.tags.map(tag => tag.title),
        };

        res.send(createdItem);
    } catch (e) {
        return next(new ErrorException(ErrorCode.UnknownError));
    }
}

export const getLatestTenItems = async (
    req: Request,
    res: Response<GetTenLatestResponse>,
    next: NextFunction,
) => {
    try {

        const latestItemsDb =  await findLatestTenItems()

        if (!latestItemsDb) return next(new ErrorException(ErrorCode.NotFound));

        const latestItemsRes: GetTenLatestResponse = latestItemsDb.map(
            ({id, title, collections: {_id: colId, image, title: colTitle, owner}}) => ({
                item: {id, title},
                collection: {id: colId.toString(), image, title: colTitle},
                // @ts-ignore
                owner: {id: owner._id.toString(), title: owner.name},
            }),
        );

        res.send(latestItemsRes);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const getItem = async (
    req: Request<{ id: string }>,
    res: Response<ItemType>,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;

        const itemDb = await findItemById(id)

        if (!itemDb) return next(new ErrorException(ErrorCode.NotFound));

        const item: ItemType = {
            id: itemDb._id.toString(),
            collection: itemDb.collections._id.toString(),
            itemFields: itemDb.itemFields,
            tags: itemDb.tags.map(tag => tag.title),
            title: itemDb.title,
        };

        res.send(item);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const updateItem = async (
    req: Request<{ id: string }, {}, UpdateItemRequestBodyType>,
    res: Response<CreateItemResponseType>,
    next: NextFunction,
) => {
    try {
        const {title, tags, itemFields} = req.body;
        const {id} = req.params;

        const tagsDbObjectIds = await findAndCreateTagId(tags)

        const updatePayload = {
            title,
            tags: tagsDbObjectIds,
            itemFields,
        };

        await ItemModel.findByIdAndUpdate(id, updatePayload);

        const updatedItemExists = await ItemModel.findOne({
            _id: id,
        }).populate<{ tags: TagSchemaType[] }>('tags');

        if (!updatedItemExists) return next(new ErrorException(ErrorCode.UnknownError));

        const updatedItem: CreateItemResponseType = {
            id: updatedItemExists._id.toString(),
            title: updatedItemExists.title,
            collection: updatedItemExists.collections._id.toString(),
            itemFields: updatedItemExists.itemFields,
            tags: updatedItemExists.tags.map(tag => tag.title),
        };

        res.send(updatedItem);
    } catch (e) {
        return next(new ErrorException(ErrorCode.UnknownError, e));
    }
}

export const getItemsByTag = async (
    req: Request<{ tag: string }, {}, {}, GetCollectionItemsRequestQueryType>,
    res: Response<GetItemsByTagResponse>,
    next: NextFunction,
) => {
    try {
        const {tag} = req.params;

        const {limit = DEFAULT_PAGE_LIMIT, page = 1} = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const tagDb = await findTag(tag)

        if (!tagDb) return next(new ErrorException(ErrorCode.NotFound));

        const itemsDb = await findByLimit(tagDb, pageNum, limitNum)

        const count = await countItem(tagDb)

        const itemsRes: GetTenLatestResponse = itemsDb.map(
            ({id, title, collections: {_id: colId, image, title: colTitle, owner}}) => ({
                item: {id, title},
                collection: {id: colId.toString(), image, title: colTitle},
                // @ts-ignore
                owner: {id: owner._id.toString(), title: owner.name},
            }),
        );

        const response = {
            items: itemsRes,
            count,
        };

        res.send(response);
    } catch (e) {
        return next(new ErrorException(ErrorCode.UnknownError, {e}));
    }
}

export const getCollectionItems = async (
    req: Request<{ id: string }, {}, {}, GetCollectionItemsRequestQueryType>,
    res: Response<GetCollectionItemsResponseType>,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;
        const {limit = DEFAULT_PAGE_LIMIT, page = 1} = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const itemsDb = await findLimitCollection(id, limitNum, pageNum)

        const count = await countCollection(id)

        const items = itemsDb.map(item => ({
            id: item._id.toString(),
            title: item.title,
            itemFields: item.itemFields.map(({title, type, value}) => ({
                title,
                type,
                value,
            })),
            tags: item.tags.map(tag => tag.title),
        }));

        res.send({items, count});
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

export const deleteItems = async (
    req: Request<{}, {}, DeleteItemsRequestType>,
    res: Response<{ deleted: string[] }>,
    next: NextFunction,
) => {
    try {
        await ItemModel.deleteMany({_id: {$in: req.body.itemIds}});

        res.send({deleted: req.body.itemIds});
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
}

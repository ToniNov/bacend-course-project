"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItems = exports.getCollectionItems = exports.getItemsByTag = exports.updateItem = exports.getItem = exports.getLatestTenItems = exports.createItem = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Item_1 = __importDefault(require("../models/Item"));
const error_exception_1 = require("../error-handler/error-exception");
const error_code_1 = require("../error-handler/error-code");
const tagService_1 = require("../services/tagService");
const itemService_1 = require("../services/itemService");
const DEFAULT_PAGE_LIMIT = 5;
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, tags, itemFields, collection } = req.body.item;
        const tagsDbObjectIds = yield (0, tagService_1.findAndCreateTagId)(tags);
        const itemObjectId = new mongoose_1.default.Types.ObjectId();
        const collectionObjectId = new mongoose_1.default.Types.ObjectId(collection);
        const newItem = {
            _id: itemObjectId,
            title,
            tags: tagsDbObjectIds,
            collections: collectionObjectId,
            itemFields,
        };
        const createdItemDb = yield (yield Item_1.default.create(newItem)).populate('tags');
        if (!createdItemDb)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        const createdItem = {
            id: createdItemDb._id.toString(),
            title: createdItemDb.title,
            collection: createdItemDb.collections._id.toString(),
            itemFields: createdItemDb.itemFields,
            tags: createdItemDb.tags.map(tag => tag.title),
        };
        res.send(createdItem);
    }
    catch (e) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
    }
});
exports.createItem = createItem;
const getLatestTenItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestItemsDb = yield (0, itemService_1.findLatestTenItems)();
        if (!latestItemsDb)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        const latestItemsRes = latestItemsDb.map(({ id, title, collections: { _id: colId, image, title: colTitle, owner } }) => ({
            item: { id, title },
            collection: { id: colId.toString(), image, title: colTitle },
            // @ts-ignore
            owner: { id: owner._id.toString(), title: owner.name },
        }));
        res.send(latestItemsRes);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getLatestTenItems = getLatestTenItems;
const getItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const itemDb = yield (0, itemService_1.findItemById)(id);
        if (!itemDb)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        const item = {
            id: itemDb._id.toString(),
            collection: itemDb.collections._id.toString(),
            itemFields: itemDb.itemFields,
            tags: itemDb.tags.map(tag => tag.title),
            title: itemDb.title,
        };
        res.send(item);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getItem = getItem;
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, tags, itemFields } = req.body;
        const { id } = req.params;
        const tagsDbObjectIds = yield (0, tagService_1.findAndCreateTagId)(tags);
        const updatePayload = {
            title,
            tags: tagsDbObjectIds,
            itemFields,
        };
        yield Item_1.default.findByIdAndUpdate(id, updatePayload);
        const updatedItemExists = yield Item_1.default.findOne({
            _id: id,
        }).populate('tags');
        if (!updatedItemExists)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        const updatedItem = {
            id: updatedItemExists._id.toString(),
            title: updatedItemExists.title,
            collection: updatedItemExists.collections._id.toString(),
            itemFields: updatedItemExists.itemFields,
            tags: updatedItemExists.tags.map(tag => tag.title),
        };
        res.send(updatedItem);
    }
    catch (e) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, e));
    }
});
exports.updateItem = updateItem;
const getItemsByTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tag } = req.params;
        const { limit = DEFAULT_PAGE_LIMIT, page = 1 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const tagDb = yield (0, tagService_1.findTag)(tag);
        if (!tagDb)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        const itemsDb = yield (0, itemService_1.findByLimit)(tagDb, pageNum, limitNum);
        const count = yield (0, itemService_1.countItem)(tagDb);
        const itemsRes = itemsDb.map(({ id, title, collections: { _id: colId, image, title: colTitle, owner } }) => ({
            item: { id, title },
            collection: { id: colId.toString(), image, title: colTitle },
            // @ts-ignore
            owner: { id: owner._id.toString(), title: owner.name },
        }));
        const response = {
            items: itemsRes,
            count,
        };
        res.send(response);
    }
    catch (e) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { e }));
    }
});
exports.getItemsByTag = getItemsByTag;
const getCollectionItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { limit = DEFAULT_PAGE_LIMIT, page = 1 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const itemsDb = yield (0, itemService_1.findLimitCollection)(id, limitNum, pageNum);
        const count = yield (0, itemService_1.countCollection)(id);
        const items = itemsDb.map(item => ({
            id: item._id.toString(),
            title: item.title,
            itemFields: item.itemFields.map(({ title, type, value }) => ({
                title,
                type,
                value,
            })),
            tags: item.tags.map(tag => tag.title),
        }));
        res.send({ items, count });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getCollectionItems = getCollectionItems;
const deleteItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Item_1.default.deleteMany({ _id: { $in: req.body.itemIds } });
        res.send({ deleted: req.body.itemIds });
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.deleteItems = deleteItems;

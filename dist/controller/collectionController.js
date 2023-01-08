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
exports.getPopularCollection = exports.deleteCollection = exports.updateCollection = exports.getUserCollections = exports.getCollection = exports.createCollection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_exception_1 = require("../error-handler/error-exception");
const error_code_1 = require("../error-handler/error-code");
const collectionService_1 = require("../services/collectionService");
const userService_1 = require("../services/userService");
const topicSrevice_1 = require("../services/topicSrevice");
const statusCodes_1 = require("../enum/statusCodes");
const Collection_1 = require("../models/Collection");
const Item_1 = __importDefault(require("../models/Item"));
const createCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, image, itemFields, owner, title, topics } = req.body;
        const collectionWithName = yield (0, collectionService_1.collectionWithNameExists)(title);
        if (collectionWithName) {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.DuplicateCollectionTitleError, { title }));
        }
        const isOwner = yield (0, userService_1.ownerExists)(owner);
        if (!isOwner) {
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.OwnerNotFound, { owner }));
        }
        const topicsDbObjectIds = yield (0, topicSrevice_1.createTopicIds)(topics);
        const newCollectionObjectId = new mongoose_1.default.Types.ObjectId();
        yield (0, collectionService_1.createNewCollection)(newCollectionObjectId, title, description, isOwner._id, topicsDbObjectIds, itemFields, image);
        const collectionCreated = yield (0, collectionService_1.createdCollectionExists)(newCollectionObjectId);
        if (!collectionCreated)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        const createdCollection = {
            id: collectionCreated._id.toString(),
            title: collectionCreated.title,
            description: collectionCreated.description,
            image: collectionCreated.image || null,
            owner: {
                id: collectionCreated.owner._id.toString(),
                name: collectionCreated.owner.name,
            },
            topics: collectionCreated.topics.map((topic) => topic.title),
            itemFields: collectionCreated.itemFields,
        };
        res.send(createdCollection);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.createCollection = createCollection;
const getCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const userCollection = yield (0, collectionService_1.userCollectionExists)(id);
        if (!userCollection)
            return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.NotFound));
        const { _id, title, description, image, owner, topics, itemFields } = userCollection;
        const collection = {
            id: _id.toString(),
            title,
            description,
            image: image || null,
            owner: { id: owner._id.toString(), name: owner.name },
            topics: topics.map(topic => topic.title),
            itemFields: itemFields.map(({ title, type }) => ({ title, type })),
        };
        res.send(collection);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getCollection = getCollection;
const getUserCollections = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userCollections = yield (0, collectionService_1.getAllUserCollection)(id);
        res.send(userCollections);
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.getUserCollections = getUserCollections;
const updateCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, image, topics, itemFields } = req.body;
        const dbPayload = { title, description, itemFields, image };
        const topicsDb = yield (0, topicSrevice_1.findTopic)(topics);
        const dbP = Object.assign(dbPayload, { topics: topicsDb });
        const updatedCollection = yield (0, collectionService_1.refreshCollection)(id, dbP);
        res.send(updatedCollection);
    }
    catch (error) {
        next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.updateCollection = updateCollection;
const deleteCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, collectionService_1.removeCollection)(id);
        res.status(statusCodes_1.STATUS_CODES.OK).end();
    }
    catch (error) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { error }));
    }
});
exports.deleteCollection = deleteCollection;
const getPopularCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const COLLECTIONS_COUNT = 5;
        const collectionsDb = yield Collection_1.CollectionModel.find({})
            .populate('topics')
            .populate('owner');
        const collectionItemCount = yield Promise.all(collectionsDb.map(({ id }) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                id,
                count: yield (yield Item_1.default.find({ collections: id })).length,
            });
        })));
        collectionItemCount.sort((a, b) => b.count - a.count);
        const biggestCollectionsIds = collectionItemCount
            .splice(0, COLLECTIONS_COUNT)
            .map(colleciton => colleciton.id);
        const fiveCollections = collectionsDb
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
    }
    catch (e) {
        return next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError, { e }));
    }
});
exports.getPopularCollection = getPopularCollection;

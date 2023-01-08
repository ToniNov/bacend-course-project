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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserCollection = exports.removeCollection = exports.refreshCollection = exports.userCollectionExists = exports.createdCollectionExists = exports.createNewCollection = exports.collectionWithNameExists = void 0;
const Collection_1 = require("../models/Collection");
const collectionWithNameExists = (title) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Collection_1.CollectionModel.findOne({ title });
    }
    catch (error) {
        throw new Error();
    }
});
exports.collectionWithNameExists = collectionWithNameExists;
const createNewCollection = (_id, title, description, owner, topics, itemFields, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCollection = {
            _id: _id,
            title,
            description,
            owner: owner,
            topics: topics,
            itemFields,
            image,
        };
        return yield Collection_1.CollectionModel.create(newCollection);
    }
    catch (error) {
        throw new Error();
    }
});
exports.createNewCollection = createNewCollection;
const createdCollectionExists = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Collection_1.CollectionModel.findOne(_id)
            .populate('topics')
            .populate('owner');
    }
    catch (error) {
        throw new Error();
    }
});
exports.createdCollectionExists = createdCollectionExists;
const userCollectionExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Collection_1.CollectionModel.findOne({ id })
            .populate('topics')
            .populate('owner');
    }
    catch (error) {
        throw new Error();
    }
});
exports.userCollectionExists = userCollectionExists;
const refreshCollection = (id, dbP) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Collection_1.CollectionModel.findByIdAndUpdate(id, dbP, { lean: true, new: true });
    }
    catch (error) {
        console.log(error);
        throw new Error();
    }
});
exports.refreshCollection = refreshCollection;
const removeCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Collection_1.CollectionModel.deleteMany({ _id: { $in: [id] } });
    }
    catch (error) {
        throw new Error();
    }
});
exports.removeCollection = removeCollection;
const getAllUserCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCollectionsDb = yield Collection_1.CollectionModel.find({ owner: id })
            .populate('topics')
            .populate('owner');
        const userCollections = userCollectionsDb.map(({ _id, title, description, image, owner, topics, itemFields }) => ({
            id: _id.toString(),
            title,
            description,
            image: image || null,
            owner: { id: owner._id.toString(), name: owner.name },
            topics: topics.map(topic => topic.title),
            itemFields,
        }));
        return yield userCollections;
    }
    catch (error) {
        throw new Error();
    }
});
exports.getAllUserCollection = getAllUserCollection;

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
exports.countCollection = exports.findLimitCollection = exports.countItem = exports.findByLimit = exports.findLatestTenItems = exports.findItemById = void 0;
const Item_1 = __importDefault(require("../models/Item"));
const findItemById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Item_1.default.findById(id)
            .populate('tags')
            .populate('collections');
    }
    catch (error) {
        throw new Error();
    }
});
exports.findItemById = findItemById;
const findLatestTenItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemsLimit = 10;
        console.log("findLatestTenItems");
        return yield Item_1.default.find({})
            .sort({ createdAt: -1 })
            .limit(itemsLimit)
            .populate({
            path: 'collections',
            populate: { path: 'owner' },
        });
    }
    catch (error) {
        throw new Error();
    }
});
exports.findLatestTenItems = findLatestTenItems;
const findByLimit = (tagDb, pageNum, limitNum) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Item_1.default.find({ tags: tagDb._id })
            .limit(limitNum * pageNum)
            .populate({
            path: 'collections',
            populate: { path: 'owner' },
        })
            .exec();
    }
    catch (error) {
        throw new Error();
    }
});
exports.findByLimit = findByLimit;
const countItem = (tagDb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Item_1.default.countDocuments({ tags: tagDb._id });
    }
    catch (error) {
        throw new Error();
    }
});
exports.countItem = countItem;
const findLimitCollection = (id, pageNum, limitNum) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Item_1.default.find({ collections: id })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .populate('tags')
            .exec();
    }
    catch (error) {
        throw new Error();
    }
});
exports.findLimitCollection = findLimitCollection;
const countCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Item_1.default.countDocuments({ collections: id });
    }
    catch (error) {
        throw new Error();
    }
});
exports.countCollection = countCollection;

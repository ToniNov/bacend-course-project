"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ItemSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    title: { type: String, required: true },
    collections: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Collection', required: true },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag', required: true }],
    itemFields: [
        {
            title: { type: String, required: true },
            type: { type: String, required: true },
            value: { type: mongoose_1.Schema.Types.Mixed, required: true },
        },
    ],
}, { collection: 'items', timestamps: true });
const ItemModel = (0, mongoose_1.model)('Item', ItemSchema);
exports.default = ItemModel;

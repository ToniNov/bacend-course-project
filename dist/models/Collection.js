"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModel = void 0;
const mongoose_1 = require("mongoose");
const CollectionSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    topics: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Topic', required: true }],
    itemFields: [
        {
            title: { type: String, required: true },
            type: { type: String, required: true },
        },
    ],
}, { collection: 'collections', timestamps: true });
exports.CollectionModel = (0, mongoose_1.model)('Collection', CollectionSchema);

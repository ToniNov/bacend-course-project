"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    message: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Item', required: true },
}, { collection: 'comments', timestamps: true });
const CommentModel = (0, mongoose_1.model)('Comment', CommentSchema);
exports.default = CommentModel;

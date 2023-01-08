"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LikeSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Item', required: true },
}, { collection: 'likes', timestamps: true });
const LikeModel = (0, mongoose_1.model)('Like', LikeSchema);
exports.default = LikeModel;

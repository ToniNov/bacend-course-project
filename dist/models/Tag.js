"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    title: { type: String, required: true },
}, { collection: 'tags', timestamps: true });
const TagModel = (0, mongoose_1.model)('Tag', TagSchema);
exports.default = TagModel;

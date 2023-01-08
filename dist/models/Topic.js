"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TopicSchema = new mongoose_1.Schema({
    _id: mongoose_1.Types.ObjectId,
    title: { type: String, required: true },
}, { collection: 'topics', timestamps: true });
const TopicModel = (0, mongoose_1.model)('Topic', TopicSchema);
exports.default = TopicModel;

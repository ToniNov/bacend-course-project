import { model, Model, Schema, Types } from 'mongoose';

export type CommentSchemaType = {
    _id: Types.ObjectId
    message: string
    user: Types.ObjectId
    item: Types.ObjectId
    createdAt?: Date;
}

const CommentSchema = new Schema<CommentSchemaType>(
    {
        _id: Types.ObjectId,
        message: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    },
    { collection: 'comments', timestamps: true },
);

const CommentModel: Model<CommentSchemaType> = model('Comment', CommentSchema);

export default CommentModel;
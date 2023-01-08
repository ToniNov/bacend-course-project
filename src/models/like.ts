import { model, Model, Schema, Types } from 'mongoose';

export type LikeSchemaType = {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    item: Types.ObjectId,
}

const LikeSchema = new Schema<LikeSchemaType>(
    {
        _id: Types.ObjectId,
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    },
    { collection: 'likes', timestamps: true },
);

const LikeModel: Model<LikeSchemaType> = model('Like', LikeSchema);

export default LikeModel;
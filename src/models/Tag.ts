import { model, Model, Schema, Types } from 'mongoose';

export type TagSchemaType = {
    _id: Types.ObjectId;
    title: string;
}

const TagSchema = new Schema<TagSchemaType>(
    {
        _id: Types.ObjectId,
        title: { type: String, required: true },
    },
    { collection: 'tags', timestamps: true },
);

const TagModel: Model<TagSchemaType> = model('Tag', TagSchema);

export default TagModel;
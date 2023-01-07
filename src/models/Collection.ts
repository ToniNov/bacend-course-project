import {model, Model, Schema, Types} from 'mongoose';

export type FieldTypesType = `number` | 'title' | 'text' | 'date' | 'check';

export type FieldType = {
    title: string;
    type: FieldTypesType;
};

export type CollectionSchemaType = {
    _id: Types.ObjectId;
    title: string;
    description: string;
    image: string | null;
    owner: Types.ObjectId;
    topics: Types.ObjectId[];
    itemFields: FieldType[];
}

const CollectionSchema = new Schema<CollectionSchemaType>(
    {
        _id: Types.ObjectId,
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        topics: [{ type: Schema.Types.ObjectId, ref: 'Topic', required: true }],
        itemFields: [
            {
                title: { type: String, required: true },
                type: { type: String, required: true },
            },
        ],
    },
    { collection: 'collections', timestamps: true },
);

export const CollectionModel: Model<CollectionSchemaType> = model('Collection', CollectionSchema);

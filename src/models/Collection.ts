import {model, Model, Schema, Types} from 'mongoose';

import ItemModel from './Item';

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

CollectionSchema.pre<any>('deleteMany', async function cb(next) {

    const deletedCollectionIdsArray = this._conditions._id.$in;
    const deletedItemIds = (
        await ItemModel.find({
            collections: { $in: deletedCollectionIdsArray },
        })
    ).map(item => item.id);

    await ItemModel.deleteMany({ _id: { $in: deletedItemIds } });
    next();
});

export const CollectionModel: Model<CollectionSchemaType> = model('Collection', CollectionSchema);

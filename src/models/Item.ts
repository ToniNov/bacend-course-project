import {model, Model, Schema, Types } from 'mongoose';
import {FieldType} from "./Collection";
import CommentModel from "./Comment";
import LikeModel from './like';

export type ItemFieldType = FieldType & { value: string | Date | boolean | number };

export type ItemSchemaType = {
    _id: Types.ObjectId;
    title: string;
    collections: Types.ObjectId;
    tags: Types.ObjectId[];
    itemFields: ItemFieldType[];
}

const ItemSchema = new Schema<ItemSchemaType>(
    {
        _id: Types.ObjectId,
        title: { type: String, required: true },
        collections: { type: Schema.Types.ObjectId, ref: 'Collection', required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
        itemFields: [
            {
                title: { type: String, required: true },
                type: { type: String, required: true },
                value: { type: Schema.Types.Mixed, required: true },
            },
        ],
    },
    { collection: 'items', timestamps: true },
);

ItemSchema.pre<any>('deleteMany', async function cb(next) {

    const deletedItemIdsArray = this._conditions._id.$in;

    await CommentModel.deleteMany({ item: { $in: deletedItemIdsArray } });
    await LikeModel.deleteMany({ item: { $in: deletedItemIdsArray } });
    next();
});

const ItemModel: Model<ItemSchemaType> = model('Item', ItemSchema);

export default ItemModel;
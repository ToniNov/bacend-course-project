import {model, Model, Schema, Types } from 'mongoose';
import {FieldType} from "./Collection";

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

const ItemModel: Model<ItemSchemaType> = model('Item', ItemSchema);

export default ItemModel;
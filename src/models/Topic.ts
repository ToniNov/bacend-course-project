import { model, Model, Schema, Types } from 'mongoose';

export type TopicSchemaType = {
  _id: Types.ObjectId;
  title: string;
}

const TopicSchema = new Schema<TopicSchemaType>(
  {
    _id: Types.ObjectId,
    title: { type: String, required: true },
  },
  { collection: 'topics', timestamps: true },
);

const TopicModel: Model<TopicSchemaType> = model('Topic', TopicSchema);

export default TopicModel;

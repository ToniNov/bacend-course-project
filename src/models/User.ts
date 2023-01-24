import mongoose, {model, Model, Schema} from "mongoose";
import { UserAccessType, UserStatusType } from "../types/AuthTypes";
import { CollectionModel } from "./Collection";

export type UserSchemaType = {
    _id: mongoose.Types.ObjectId
    email: string
    password: string
    name: string
    access: UserAccessType
    status: UserStatusType
}

const UserSchema = new Schema<UserSchemaType>(
    {
        _id: mongoose.Types.ObjectId,
        email: {type: String, required: true, lowercase: true, unique: true},
        password: {type: String, required: true},
        name: {type: String, required: true},
        access: {type: String, required: true},
        status: {type: String, required: true},
    },
    {collection: 'users', timestamps: true},
);

UserSchema.pre<any>('deleteMany', async function cb(next) {

    const deletedUserIdsArray = this._conditions._id.$in;
    const deletedCollectionsIdsArray = (
        await CollectionModel.find({
            owner: { $in: deletedUserIdsArray },
        })
    ).map(collection => collection.id);

    await CollectionModel.deleteMany({ _id: { $in: deletedCollectionsIdsArray } });
    next();
});

export const UserModel: Model<UserSchemaType> = model('User', UserSchema);

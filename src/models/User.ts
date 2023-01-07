import mongoose, {model, Model, Schema} from "mongoose";
import { UserAccessType, UserStatusType } from "../types/AuthTypes";

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

export const UserModel: Model<UserSchemaType> = model('User', UserSchema);

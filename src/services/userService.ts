import {SignUpRequestBodyType} from "../types/AuthTypes";
import {Status} from "../enum/status";
import {Access} from "../enum/access";
import {passwordHash} from "../utils/password-hash";
import {UserModel, UserSchemaType} from "../models/User";
import mongoose from "mongoose";

export const userWithEmailExists = async (email: string): Promise<UserSchemaType | undefined | null> => {
    try {
        return await UserModel.findOne({ email });
    } catch (error) {
        throw new Error()
    }
}

export const userWithNameExists = async (name: string): Promise<UserSchemaType | undefined | null> => {
    try {
        return await UserModel.findOne({ name });
    } catch (error) {
        throw new Error()
    }
}

export const userWithIdExists = async (_id: string): Promise<UserSchemaType | undefined | null> => {
    try {
        return await UserModel.findOne({ _id });
    } catch (error) {
        throw new Error()
    }
}

export const createUser = async (payload: SignUpRequestBodyType)=> {
    try {

        const { email, name, password } = payload
        const status = Status.Active;
        const access = Access.Basic
        const hashedPassword = await passwordHash(password);

        const userNew = {
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            status,
            access,
            password:hashedPassword,
        };
        return await UserModel.create(userNew);
    } catch (error) {
        throw new Error('Err with creating user')
    }
}

export const ownerExists = async (owner: string) => {
    try {
        return await UserModel.findOne({ _id: owner });
    } catch (error) {
        throw new Error()
    }
}





import ItemModel from "../models/Item";
import {TagSchemaType} from "../models/Tag";
import {CollectionSchemaType} from "../models/Collection";


export const findItemById = async (id: string) => {
    try {
        return await ItemModel.findById(id)
            .populate<{ tags: TagSchemaType[] }>('tags')
            .populate<{ collections: CollectionSchemaType }>('collections');
    } catch (error) {
        throw new Error()
    }
};

export const findLatestTenItems = async () => {
    try {

        const itemsLimit = 10;

        console.log("findLatestTenItems")

        return await ItemModel.find({})
            .sort({createdAt: -1})
            .limit(itemsLimit)
            .populate<{ collections: CollectionSchemaType }>({
                path: 'collections',
                populate: {path: 'owner'},
            })

    } catch (error) {
        throw new Error()
    }
}

export const findByLimit = async (tagDb: any, pageNum: number, limitNum: number) => {
    try {
        return await ItemModel.find({tags: tagDb._id})
            .limit(limitNum * pageNum)
            .populate<{ collections: CollectionSchemaType }>({
                path: 'collections',
                populate: {path: 'owner'},
            })
            .exec();
    } catch (error) {
        throw new Error()
    }
}

export const countItem = async (tagDb: any ) => {
    try {
        return await ItemModel.countDocuments({ tags: tagDb._id });
    } catch (error) {
        throw new Error()
    }
}

export const findLimitCollection = async (id: string, limitNum: number, pageNum: number, ) => {
    try {

        return await ItemModel.find({collections: id})
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .populate<{
                tags: TagSchemaType[];
            }>('tags')
            .exec();

    } catch (error) {
        throw new Error()
    }
}

export const countCollection = async (id: string ) => {
    try {
        return await ItemModel.countDocuments({collections: id});
    } catch (error) {
        throw new Error()
    }
}
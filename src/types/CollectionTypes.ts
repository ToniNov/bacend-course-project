import { FieldType } from "../models/Collection";

export type CollectionRequestType = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    owner: string;
    topics: string[];
    itemFields: FieldType[];
};
export type CollectionResponseType = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    owner: { id: string; name: string };
    topics: string[];
    itemFields: FieldType[];
};

export type GetUserCollectionsResponseType = CollectionResponseType[];

export type CreateCollectionRequestType = Omit<CollectionRequestType, 'id'>;

export type CreateCollectionResponseType = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    owner: { id: string; name: string };
    topics: string[];
    itemFields: FieldType[];
};

export type GetTopicsResponseType = string[];

export type DeleteCollectionRequestType = { id: string };

export type UpdateCollectionRequestParamType = { id: string };
export type UpdateCollectionRequestBodyType = {
    title: string;
    description: string;
    image: string | null;
    topics: string[];
    itemFields: FieldType[];
};

export type dbPayloadType =  {
    title: string,
    description: string,
    itemFields: FieldType[],
    image: string | null
}

export type UpdateCollectionResponseType = {
    id: string;
    title: string;
    description: string;
    image: string | null;
    owner: { id: string; name: string };
    topics: string[];
    itemFields: FieldType[];
};
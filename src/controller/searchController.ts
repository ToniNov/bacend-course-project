import {NextFunction, Request, Response} from 'express';
import ItemModel, {ItemSchemaType} from '../models/Item';
import {CollectionModel, CollectionSchemaType} from "../models/Collection";
import CommentModel, {CommentSchemaType} from "../models/Comment";
import {UserModel} from "../models/User";
import {ErrorException} from "../error-handler/error-exception";
import {ErrorCode} from '../error-handler/error-code';

import {
    HighlightType,
    SearchByQueryRequest,
    SearchByQueryResponse
} from "../types/SearchTypes";

export const searchByQuery = async (
    req: Request<{}, {}, {}, SearchByQueryRequest>,
    res: Response<SearchByQueryResponse>,
    next: NextFunction,
) => {
    try {

        const searchAnswerCount = 5;

        const {query} = req.query;

        const result: SearchByQueryResponse = [];

        const searchItemsResult = await ItemModel.aggregate<ItemSchemaType & { highlights: HighlightType[] }>([
            {
                $search: {
                    index: 'items_text',
                    text: {
                        query,
                        path: ['title', 'itemFields.value'],
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                    highlight: {
                        path: ['title', 'itemFields.value'],
                    },
                },
            },
        ])
            .addFields({
                highlights: {
                    $meta: 'searchHighlights',
                },
            })
            .limit(searchAnswerCount);

        const searchCollectionsResult = await CollectionModel.aggregate<CollectionSchemaType & { highlights: HighlightType[] }>([
            {
                $search: {
                    index: 'collections_text',
                    text: {
                        query,
                        path: ['title', 'description'],
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                    highlight: {
                        path: ['title', 'description'],
                    },
                },
            },
        ])
            .addFields({
                highlights: {
                    $meta: 'searchHighlights',
                },
            })
            .limit(searchAnswerCount);

        const searchCommentsResult = await CommentModel.aggregate<CommentSchemaType & { highlights: HighlightType[] }>([
            {
                $search: {
                    index: 'comments_text',
                    text: {
                        query,
                        path: 'message',
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                    highlight: {
                        path: 'message',
                    },
                },
            },
        ])
            .addFields({
                highlights: {
                    $meta: 'searchHighlights',
                },
            })
            .limit(searchAnswerCount);

        searchItemsResult.forEach(({_id, title, highlights}) => {
            result.push({
                id: _id.toString(),
                title,
                highlight: highlights.sort((a, b) => b.score - a.score)[0],
                type: 'Item',
            });
        });

        searchCollectionsResult.forEach(({_id, title, highlights}) => {
            result.push({
                id: _id.toString(),
                title,
                highlight: highlights.sort((a, b) => b.score - a.score)[0],
                type: 'Collection',
            });
        });

        const mappedComments = await Promise.all(
            searchCommentsResult.map(async ({item, user, highlights}) => {
                const userDb = await UserModel.findById(user);
                return {
                    id: item.toString(),
                    title: userDb ? userDb.name : '',
                    highlight: highlights.sort((a, b) => b.score - a.score)[0],
                };
            }),
        );

        mappedComments.forEach(comment => {
            result.push({...comment, type: 'Comment'});
        });

        result.sort((a: any, b: any) => b.highlight.score - a.highlight.score);

        res.send(result);
    } catch (error) {
        return next(new ErrorException(ErrorCode.UnknownError, {error}));
    }
};

import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import express, {Application, Request, Response} from 'express';
import mongoose from "mongoose";
import { Server } from 'socket.io';

import {connect} from './database/Connection'
import { CommentResponseType } from './types/CommentsType';
import { UserModel } from './models/User';
import CommentModel from './models/Comment';
import {errorHandler} from "./error-handler/error-handler";
import {Path} from "./enum/path";
import authorization from "./routes/authorization"
import collections from "./routes/collection";
import items from "./routes/item";
import tags from "./routes/tags";
import users from "./routes/users";
import likes from './routes/likes';
import comments from './routes/comment';
import topic from './routes/topics';
import search from "./routes/search";

dotenv.config();

mongoose.set('strictQuery', true);

const DEFAULT_PORT = 7654;

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
    path: '/socket',
    cors: {
        origin: "*",
    },
});

app.use(cors({
    origin: '*',
}));

app.use(express.urlencoded({extended: true,}));
app.use(express.json());

async function run() {
    await connect();
}
run().catch(err => console.log(err));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello express!');
});

app.use(Path.Auth, authorization)
app.use(Path.Topics, topic)
app.use(Path.Collection, collections)
app.use(Path.Items, items)
app.use(Path.Tags, tags)
app.use(Path.Users, users)
app.use(Path.Likes, likes)
app.use(Path.Comments, comments)
app.use(Path.Search, search)

app.use(errorHandler);

io.on('connection', socket => {
    socket.on('itemId', (itemId: string) => {
        const commentsChangeStream = CommentModel.watch();
        commentsChangeStream.on('change', async data => {
            try {
                if (data.operationType === 'insert') {
                    const { item, _id, createdAt, message, user } = data.fullDocument;
                    const userDb = await UserModel.findById(user._id.toString());

                    if (!userDb) return;
                    const userRes = { id: userDb.id.toString(), name: userDb.name };

                    if (itemId === item.toString()) {
                        const comment: CommentResponseType = {
                            id: _id.toString(),
                            date: createdAt!.toString(),
                            item: item.toString(),
                            message,
                            user: userRes,
                        };

                        io.to(socket.id).emit('newComment', comment);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
    });
});

const PORT = process.env.PORT || DEFAULT_PORT

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

import http from 'http';
import cors from 'cors';
import {config} from 'dotenv';
import express, {Application, Request, Response} from 'express';
import mongoose from "mongoose";

import {connect} from './database/db'

import {Path} from "./enum/path";
import authorization from "./routes/authorization"
import collections from "./routes/collection";
import items from "./routes/item";
import tags from "./routes/tags";
import users from "./routes/users";
import {getTopics} from "./controller/topicController";


config();
mongoose.set('strictQuery', true);

const DEFAULT_PORT = 7654;

const app: Application = express();
const server = http.createServer(app);
app.use(cors({
    origin: '*',
}));

app.use(express.urlencoded({extended: true,}));
app.use(express.json());

console.log("test")

connect();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello express!');
});

app.use(Path.Auth, authorization)
app.use(Path.Topics, getTopics)
app.use(Path.Collection, collections)
app.use(Path.Items, items)
app.use(Path.Tags, tags)
app.use(Path.Users, users)

const PORT = process.env.PORT || DEFAULT_PORT

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

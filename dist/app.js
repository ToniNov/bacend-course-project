"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const db_1 = require("./database/db");
const path_1 = require("./enum/path");
const authorization_1 = __importDefault(require("./routes/authorization"));
const collection_1 = __importDefault(require("./routes/collection"));
const item_1 = __importDefault(require("./routes/item"));
const tags_1 = __importDefault(require("./routes/tags"));
const users_1 = __importDefault(require("./routes/users"));
const likes_1 = __importDefault(require("./routes/likes"));
const comment_1 = __importDefault(require("./routes/comment"));
const User_1 = require("./models/User");
const Comment_1 = __importDefault(require("./models/Comment"));
const topicController_1 = require("./controller/topicController");
(0, dotenv_1.config)();
mongoose_1.default.set('strictQuery', true);
const DEFAULT_PORT = 7654;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: '/socket',
    cors: {
        origin: "*",
    },
});
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.urlencoded({ extended: true, }));
app.use(express_1.default.json());
(0, db_1.connect)();
app.get('/', (req, res) => {
    res.send('Hello express!');
});
app.use(path_1.Path.Auth, authorization_1.default);
app.use(path_1.Path.Topics, topicController_1.getTopics);
app.use(path_1.Path.Collection, collection_1.default);
app.use(path_1.Path.Items, item_1.default);
app.use(path_1.Path.Tags, tags_1.default);
app.use(path_1.Path.Users, users_1.default);
app.use(path_1.Path.Likes, likes_1.default);
app.use(path_1.Path.Comments, comment_1.default);
io.on('connection', socket => {
    socket.on('itemId', (itemId) => {
        const commentsChangeStream = Comment_1.default.watch();
        commentsChangeStream.on('change', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (data.operationType === 'insert') {
                    const { item, _id, createdAt, message, user } = data.fullDocument;
                    const userDb = yield User_1.UserModel.findById(user._id.toString());
                    if (!userDb)
                        return;
                    const userRes = { id: userDb.id.toString(), name: userDb.name };
                    if (itemId === item.toString()) {
                        const comment = {
                            id: _id.toString(),
                            date: createdAt.toString(),
                            item: item.toString(),
                            message,
                            user: userRes,
                        };
                        io.to(socket.id).emit('newComment', comment);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }));
    });
});
const PORT = process.env.PORT || DEFAULT_PORT;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

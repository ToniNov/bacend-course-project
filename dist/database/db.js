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
exports.connect = void 0;
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const CONNECTED = 1;
const CONNECTING = 2;
let mongooseConnection = null;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoose_1.default.connection.on('connecting', () => {
                console.log(`MongoDB: connecting.`);
            });
            mongoose_1.default.connection.on('connected', () => {
                console.log('MongoDB: connected.');
            });
            mongoose_1.default.connection.on('disconnecting', () => {
                console.log('MongoDB: disconnecting.');
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('MongoDB: disconnected.');
            });
            if (mongoose_1.default.connection.readyState !== CONNECTED &&
                mongoose_1.default.connection.readyState !== CONNECTING) {
                const conn = yield mongoose_1.default.connect(process.env.DB_URL, {
                    autoIndex: true,
                    serverSelectionTimeoutMS: 5000,
                });
                mongooseConnection = conn.connection;
            }
        }
        catch (error) {
            console.log(`Error connecting to DB`, error);
        }
        return mongooseConnection;
    });
}
exports.connect = connect;

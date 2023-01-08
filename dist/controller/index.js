"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = exports.LikesController = exports.UsersController = exports.TagController = exports.ItemController = exports.TopicController = exports.CollectionController = exports.AuthorizationController = void 0;
exports.AuthorizationController = __importStar(require("./authorizationController"));
exports.CollectionController = __importStar(require("./collectionController"));
exports.TopicController = __importStar(require("./topicController"));
exports.ItemController = __importStar(require("./itemController"));
exports.TagController = __importStar(require("./tagController"));
exports.UsersController = __importStar(require("./usersController"));
exports.LikesController = __importStar(require("./likesController"));
exports.CommentsController = __importStar(require("./commentsController"));

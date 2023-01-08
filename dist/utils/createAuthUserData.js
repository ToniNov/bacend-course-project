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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthUserData = void 0;
const secret_1 = require("../enum/secret");
const jwt = require('jsonwebtoken');
const createAuthUserData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInstance = JSON.parse(JSON.stringify(user));
    const token = jwt.sign({
        _id: userInstance._id,
    }, secret_1.Secret.Secret, { expiresIn: '2d' });
    const { password } = userInstance, otherUserData = __rest(userInstance, ["password"]);
    return Promise.resolve(Object.assign({ token }, otherUserData));
});
exports.createAuthUserData = createAuthUserData;

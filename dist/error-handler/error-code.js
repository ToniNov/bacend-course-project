"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
class ErrorCode {
}
exports.ErrorCode = ErrorCode;
ErrorCode.Unauthenticated = 'Account doesnt exist';
ErrorCode.Authorized = 'You are not authorized';
ErrorCode.Blocked = 'Account is blocked';
ErrorCode.DuplicateEmailError = 'Email allready taken';
ErrorCode.DuplicateUserNameError = 'Name allready taken';
ErrorCode.DuplicateCollectionTitleError = 'Collection.ts title already taken';
ErrorCode.OwnerNotFound = 'Owner not found';
ErrorCode.NotAllowed = 'You are not allowed to access this resource';
ErrorCode.NotFound = 'NotFound';
ErrorCode.MaximumAllowedGrade = 'MaximumAllowedGrade';
ErrorCode.AsyncError = 'AsyncError';
ErrorCode.UnknownError = 'UnknownError';

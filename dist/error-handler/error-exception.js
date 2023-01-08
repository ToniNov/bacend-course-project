"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorException = void 0;
const error_code_1 = require("./error-code");
const statusCodes_1 = require("../enum/statusCodes");
class ErrorException extends Error {
    constructor(code = error_code_1.ErrorCode.UnknownError, metaData = null) {
        super(code);
        this.status = null;
        this.metaData = null;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = code;
        this.status = statusCodes_1.STATUS_CODES.UNKNOWN_ERROR;
        this.metaData = metaData;
        switch (code) {
            case error_code_1.ErrorCode.Unauthenticated:
            case error_code_1.ErrorCode.Blocked:
            case error_code_1.ErrorCode.NotAllowed:
                this.status = statusCodes_1.STATUS_CODES.UNAUTHORIZED;
                break;
            case error_code_1.ErrorCode.MaximumAllowedGrade:
            case error_code_1.ErrorCode.DuplicateEmailError:
            case error_code_1.ErrorCode.DuplicateUserNameError:
            case error_code_1.ErrorCode.DuplicateCollectionTitleError:
            case error_code_1.ErrorCode.OwnerNotFound:
                this.status = statusCodes_1.STATUS_CODES.BAD_REQUEST;
                break;
            case error_code_1.ErrorCode.AsyncError:
                this.status = statusCodes_1.STATUS_CODES.BAD_REQUEST;
                break;
            case error_code_1.ErrorCode.NotFound:
                this.status = statusCodes_1.STATUS_CODES.NOT_FOUND;
                break;
            default:
                this.status = statusCodes_1.STATUS_CODES.UNKNOWN_ERROR;
                break;
        }
    }
}
exports.ErrorException = ErrorException;

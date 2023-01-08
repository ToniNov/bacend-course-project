"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const statusCodes_1 = require("../enum/statusCodes");
const error_code_1 = require("./error-code");
const error_exception_1 = require("./error-exception");
const errorHandler = (err, req, res, next) => {
    console.log('Error handling middleware called.');
    console.log('Path:', req.path);
    console.error('Error occured:', err);
    if (err instanceof error_exception_1.ErrorException) {
        console.log('Error is known.');
        res.status(err.status).send(err);
    }
    else {
        res.status(statusCodes_1.STATUS_CODES.UNKNOWN_ERROR).send({
            code: error_code_1.ErrorCode.UnknownError,
            status: statusCodes_1.STATUS_CODES.UNKNOWN_ERROR,
        });
    }
};
exports.errorHandler = errorHandler;

const { StatusCodes } = require('http-status-codes');

class UnauthenticatedError extends Error {
    constructor(msg) {
        super(msg);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;

const { StatusCodes } = require('http-status-codes');

class NotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
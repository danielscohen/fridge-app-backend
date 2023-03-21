const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authheader empty');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = {
            userId: payload.UserInfo.userId,
            name: payload.UserInfo.name,
            roles: payload.UserInfo.roles
        };
        next();
    } catch (error) {
        throw new UnauthenticatedError(error);
    }
}

module.exports = auth;
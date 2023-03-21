const Account = require('../models/Account');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');


const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        throw new BadRequestError('Refresh Token Missing');
    }

    const refreshToken = cookies.jwt;

    const account = await Account.findOne({ refreshToken });
    if (!account) {
        throw new UnauthenticatedError('Invalid Credentials.');
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload.userId !== account.userId) {
            throw new UnauthenticatedError('Invalid Credentials.');
        }

        const accessToken = account.createAccessToken();
        res.status(StatusCodes.OK).json({
            accessToken
        })
    } catch (error) {
        throw new UnauthenticatedError(error);
    }
}

module.exports = refreshToken;

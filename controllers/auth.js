const Account = require('../models/Account');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const account = await Account.create(req.body);
    const token = account.createAccessToken();
    res.status(StatusCodes.CREATED).json({
        user: {
            name: account.name
        },
        token
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password.');
    }

    const account = await Account.findOne({ email });
    if (!account) {
        throw new UnauthenticatedError('Invalid Credentials.');
    }
    const isPasswordCorrect = await account.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials.');
    }


    const accessToken = account.createAccessToken();
    const refreshToken = account.createRefreshToken();

    account.refreshToken = refreshToken;
    account.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(StatusCodes.OK).json({
        user: {
            name: account.name
        },
        accessToken
    })
}

const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        throw new UnauthenticatedError('Invalid Credentials.');
    }

    const refreshToken = cookies.jwt;

    const account = await Account.findOne({ refreshToken });
    if (!account) {
        throw new UnauthenticatedError('Invalid Credentials.');
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(`payload: ${payload.userId} db: ${account._id}`)
        if (!account._id.equals(payload.userId)) {
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

const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    const refreshToken = cookies.jwt;

    const account = await Account.findOne({ refreshToken });
    if (!account) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    account.refreshToken = '';
    account.save();


    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(StatusCodes.NO_CONTENT);
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}
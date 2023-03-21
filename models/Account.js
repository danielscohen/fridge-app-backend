const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const requiredText = field => `A ${field} is required`;

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, requiredText('name')],
        maxlength: 50,
        minlength: 3,
        trim: true,
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        required: [true, requiredText('email')],
        unique: true,
    },
    password: {
        type: String,
        required: [true, requiredText('password')],
        minlength: 8,
    },
    refreshToken: {
        type: String
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    }
});

AccountSchema.pre('save', async function () {
    if (this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

AccountSchema.methods.createAccessToken = function () {
    const roles = Object.values(this.roles);
    return jwt.sign({
        UserInfo: {
            userId: this._id,
            roles: roles
        }
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFETIME), })
}

AccountSchema.methods.createRefreshToken = function () {
    const roles = Object.values(this.roles);
    return jwt.sign({
        userId: this._id
    }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFETIME, })
}

AccountSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('Account', AccountSchema);
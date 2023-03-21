const { UnauthenticatedError } = require('../errors');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user.roles) throw new UnauthenticatedError('Access Denied');
        const rolesArray = [...allowedRoles];
        const result = req.user.roles.filter(role => rolesArray.includes(role)).length;
        if (!result) throw new UnauthenticatedError('Access Denied');
        next();
    }
}

module.exports = verifyRoles;
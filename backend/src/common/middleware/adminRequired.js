const ApiError = require("../errors/ApiError");

module.exports = (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!req.user.isAdmin) return next(ApiError.forbidden("Admins only"));

    next();
};

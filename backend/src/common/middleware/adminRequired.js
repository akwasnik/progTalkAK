const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const ApiError = require(path.join(SRC, "common", "errors", "ApiError"));
const authRequired = require(path.join(SRC, "common", "middleware", "authRequired"));

module.exports = (req, res, next) => {
    authRequired(req, res, (err) => {
        if (err) return next(err);

        if (!req.user.isAdmin) {
            return next(ApiError.forbidden("Admins only"));
        }

        next();
    });
};
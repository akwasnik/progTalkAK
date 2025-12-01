const passport = require("passport");
const ApiError = require("../errors/ApiError");

module.exports = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(ApiError.unauthorized("Invalid or missing token"));

        req.user = user;
        next();
    })(req, res, next);
};

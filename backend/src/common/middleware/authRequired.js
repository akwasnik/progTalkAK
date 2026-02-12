const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const ApiError = require(path.join(SRC,"common","errors","ApiError"));

const passport = require("passport");


module.exports = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) return next(ApiError.unauthorized("Invalid or missing token"));

        req.user = user;
        next();
    })(req, res, next);
};

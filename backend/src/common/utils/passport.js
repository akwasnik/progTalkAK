const { Strategy: JwtStrategy } = require("passport-jwt");
const path = require("node:path");
const SRC = path.join(process.cwd(), "src");

const userRepository = require(path.join(SRC,"modules","users","user.repository"));
const conf = require(path.join(SRC, "config"));
const cookieExtractor = require(path.join(SRC,"common","utils","jwtCookieExtractor"));

module.exports = (passport) => {
    const opts = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: conf.SECRET
    };

    passport.use(
        new JwtStrategy(opts, async (jwtPayload, done) => {
            try {
                const user = await userRepository.findById(jwtPayload.id);
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        })
    );
};

const path = require('node:path');
const SRC = path.join(process.cwd(),"src");

const authService = require(path.join(SRC,"modules","auth","auth.service"));

class AuthController {

    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            const data = await authService.login(login, password);
            res.json(data);
            // .cookie("token", data.token, {
            //     httpOnly: true,
            //     sameSite: "lax",
            //     maxAge: 24 * 60 * 60 * 1000,
            // });
        } catch (err) {
            next(err);
        }
    }

    async logout(_req,res,next){
        try {
            res.json({msg: "logged out"}); // TO DO
            // .clearCookie("token")
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();

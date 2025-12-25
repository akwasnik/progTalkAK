const path = require('node:path');
const SRC = path.join(process.cwd(),"src");

const authService = require(path.join(SRC,"modules","auth","auth.service"));

class AuthController {

    async me(req, res) {
        res.json({
            id: req.user._id,
            login: req.user.login,
            isAdmin: req.user.isAdmin,
            isAllowed: req.user.isAllowed
        });
    }

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
            const { token, user } = await authService.login(login, password);
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000 // 24h
            })
            .status(200)
            .json({
                user: {
                    id: user._id,
                    login: user.login,
                    isAdmin: user.isAdmin,
                    isAllowed: user.isAllowed
                }
            });
            
        } catch (err) {
            next(err);
        }
    }

    async logout(_req,res,next){
        try {
            res.clearCookie("token")
            .json({ msg: "logged out" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();

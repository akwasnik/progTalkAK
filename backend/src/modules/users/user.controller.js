const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const userService = require(path.join(SRC,"modules","users","user.service"));

class UserController {

    async register(req, res, next) {
        try {
            const user = await userService.register(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await userService.getProfile(req.params.id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            const updated = await userService.updateUser(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    async listAll(_req, res, next) {
        try {
            const users = await userService.listAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async makeAdmin(req, res, next) {
        try {
            const user = await userService.makeAdmin(req.params.id);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async setAllowed(req, res, next) {
        try {
            const { allowed } = req.body; // boolean
            const user = await userService.setAllowed(req.params.id, allowed);
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
    
    async deleteUser(req, res, next) {
        try {
            await userService.removeUser(req.params.id);
            res.status(204).send(); //tylko headersy
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();

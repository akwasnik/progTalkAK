const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const userRepository = require(path.join(SRC,"modules","users","user.repository"));
const conf = require(path.join(SRC, 'config',));

const { emitToAdmins } = require(path.join(SRC, "sockets", "socket"));

const jwt = require("jsonwebtoken");
const { genHash,cmpHash } = require(path.join(SRC,"common","utils","hash"));

const ApiError = require(path.join(SRC,"common","errors","ApiError"));

class AuthService {

    async register(data) {
        const exists = await userRepository.findByLogin(data.login);
        if (exists) throw ApiError.badRequest("Login already taken");

        const hashedPassword = genHash(data.password);

        const user = await userRepository.createUser({
            login: data.login,
            passwordHashed: hashedPassword,
            registrationDate: new Date(),
            isAdmin: false,
            isAllowed: false
        });
        
        emitToAdmins("user-awaiting-approval", {
            message: `User ${user.login} is awaiting approval` 
        });

        return user;
    }

    async registerAdmin(data) {
        const exists = await userRepository.findByLogin(data.login);
        if (exists) throw ApiError.badRequest("Login already taken");

        const hashedPassword = genHash(data.password);

        const user = await userRepository.createUser({
            login: data.login,
            passwordHashed: hashedPassword,
            registrationDate: new Date(),
            isAdmin: true,
            isAllowed: true
        });

        return user;
    }

    async login(login, password) {
        const user = await userRepository.findByLogin(login);
        if (!user) throw ApiError.unauthorized("Invalid credentials");

        const match = cmpHash(password,user.passwordHashed)
        if (!match) throw ApiError.unauthorized("Invalid credentials");

        const token = jwt.sign(
            { id: user._id },
            conf.SECRET,
            { expiresIn: '1d' }
        );

        return { token, user };
    }
}

module.exports = new AuthService();

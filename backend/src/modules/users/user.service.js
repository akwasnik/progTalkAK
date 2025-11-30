const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const userRepository = require(path.join(SRC,"modules","users","user.repository"));
const ApiError = require(path.join(SRC,"common","errors","ApiError"));

class UserService {

    async register(data) {
        const existing = await userRepository.findByLogin(data.login);
        if (existing) {
            throw ApiError.badRequest("Login already taken");
        }

        const user = await userRepository.createUser({
            ...data,
            registrationDate: new Date(),
            isAdmin: false,
            isAllowed: false
        });

        return user;
    }

    async getProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async updateUser(id, data) {
        const user = await userRepository.updateUser(id, data);

        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async listAll() {
        return userRepository.getAll();
    }
    
    async makeAdmin(id) {
        const user = await userRepository.makeAdmin(id);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async setAllowed(id, isAllowed) {
        const user = await userRepository.setAllowed(id, isAllowed);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async removeUser(id) {
        const deleted = await userRepository.deleteUser(id);
        if (!deleted) throw ApiError.notFound("User not found");
        return deleted;
    }
}

module.exports = new UserService();

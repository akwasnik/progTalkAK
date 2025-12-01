const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const userRepository = require(path.join(SRC,"modules","users","user.repository"));
const ApiError = require(path.join(SRC,"common","errors","ApiError"));
const { genHash } = require(path.join(SRC,"common","utils","hash"));

class UserService {
    async getProfile(id) {
        const user = await userRepository.findById(id);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async updatePassword(id, newPassword) {
        if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
            throw ApiError.badRequest("New password is invalid");
        }

        const passwordHashed = genHash(newPassword);

        const updated = await userRepository.updatePassword(id, passwordHashed);
        if (!updated) {
            throw ApiError.notFound("User not found");
        }

        return updated;
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

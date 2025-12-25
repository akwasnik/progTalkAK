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

    async updatePassword(currentUser, targetUserId, newPassword) {
        if (!(currentUser.isAdmin || currentUser._id.toString() === targetUserId)) {
            throw ApiError.forbidden("You can update only your own password");
        }

        if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
            throw ApiError.badRequest("New password is invalid");
        }

        const passwordHashed = genHash(newPassword);

        const oldPassword = await currentUser.passwordHashed;

        if (passwordHashed === oldPassword ){
            throw ApiError.badRequest("New password is the same as old one");
        }

        const updated = await userRepository.updatePassword(
            targetUserId,
            passwordHashed
        );

        if (!updated) {
            throw ApiError.notFound("User not found");
        }

        return updated;
    }

    async listAll() {
        return userRepository.getAll();
    }

    async getNotAllowed() {
        const users = await userRepository.getNotAllowed();

        if (!users || users.length === 0) {
            throw ApiError.notFound("No users awaiting approval");
        }

        return users;
    }

    async getAdmins() {
        return userRepository.getAdmins();
    }

    
    async makeAdmin(id, isAdmin) {
        const user = await userRepository.makeAdmin(id,isAdmin);
        if (!user) throw ApiError.notFound("User not found");
        return user;
    }

    async setAllowed(id, isAllowed) {
        const user = await userRepository.allowUser(id, isAllowed);
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

const path = require('node:path');
const SRC = path.join(process.cwd(),"src");
const User = require(path.join(SRC,"modules","users","user.model"));

class UserRepository {

    async findByLogin(login) {
        return User.findOne({ login });
    }

    async findById(id) {
        return User.findById(id);
    }

    async createUser(data) {
        const user = new User(data);
        return user.save();
    }

    async updatePassword(id, passwordHashed) {
        return User.findByIdAndUpdate(id, { passwordHashed }, { new: true });
    }

    async getAll() {
        return User.find();
    }

    async getNotAllowed() {
        return User.find({ isAllowed: false });
    }

    async getAdmins() {
        return User.find({ isAdmin: true });
    }



    async makeAdmin(id, isAdmin) {
        return User.findByIdAndUpdate(
            id,
            { isAdmin }, // -||-
            { new: true } // -||-
        );
    }
    
    async existsAdmin() {
        return User.exists({ isAdmin: true });
    }

    async allowUser(id, isAllowed) {
        return User.findByIdAndUpdate(
            id,
            { isAllowed }, // sets isAllowed
            { new: true } // returns updated object not the old one
        );
    }

    async deleteUser(id) {
        return User.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();

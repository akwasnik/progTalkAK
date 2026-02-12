const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    passwordHashed: { type: String, required: true },
    registrationDate: { type: Date, required: true },
    isAdmin: { type: Boolean, required: true },
    isAllowed: { type: Boolean, required: true },
});

module.exports = model('User', userSchema);

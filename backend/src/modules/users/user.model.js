const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    registrationDate: Date,
    isAdmin: Boolean,
    isAllowed: Boolean,
});

module.exports = model('User', userSchema);

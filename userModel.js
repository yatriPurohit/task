// models/userModel.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    image: {
        data: Buffer,
        contentType: String,
    },
    gender: String,
    hobbies: [String],
});

const User = model('User', userSchema);

module.exports = User;

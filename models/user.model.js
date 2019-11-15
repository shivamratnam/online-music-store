// Import statements
var mongoose = require('mongoose');

// Create User Schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    }
});

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
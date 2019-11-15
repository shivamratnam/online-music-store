// Import statements
var mongoose = require('mongoose');

// Create User Schema
var LikedSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    prodId: {
        type: String,
        required: true
    },
    prodName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

var LikedModel = mongoose.model('like', LikedSchema);

module.exports = LikedModel;
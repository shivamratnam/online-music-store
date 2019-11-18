// Import statements
var mongoose = require('mongoose');

// Create User Schema
var CartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    prodId: {
        type: String,
        required: true
    }
});

var CartModel = mongoose.model('mycart', CartSchema);

module.exports = CartModel;
// Import statements
var mongoose = require('mongoose');

// Create User Schema
var OrderSchema = new mongoose.Schema({
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
    },
    purchaseDate: {
        type: Date,
        required: true
    }
});

var OrdersModel = mongoose.model('orders', OrderSchema);

module.exports = OrdersModel;
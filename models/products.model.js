// Import statements
var mongoose = require('mongoose');

// Create User Schema
var ProductSchema = new mongoose.Schema({
    prodName: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    imgPath: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    details: {
        Weight: String,
        Dimension: String,
        Batteries: String,
        Model_Number: String,
        Colour: String,
        Size: String,
        Battery_Type: String
    }
});

var ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
const ProductModel = require('../models/products.model');

exports.home_page = (req, res) => {
    let isUser = req.user ? true : false;
    ProductModel.find({}, (err, result) => {
        if(err) throw err;

        // Return items
        res.render('home/home-page', {
            title: 'Music Store',
            isUser: isUser,
            products: result
        });
    });
}
exports.product_details = (req, res) => {
    let id = req.params.id;
    let isUser = req.user ? true : false;
    ProductModel.findById(id, (err, result) => {
        if(err) throw err;
        
        // Return item
        res.render('home/item-details', {
            title: 'Product Details',
            isUser: isUser,
            product: result
        });
    });
}
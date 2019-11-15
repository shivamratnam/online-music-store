const ProductModel = require('../models/products.model');

exports.home_page = (req, res) => {
    ProductModel.find({}, (err, result) => {
        if(err) throw err;

        // Return items
        res.render('home/home-page', {
            title: 'Music Store',
            products: result
        });
    });
}
exports.product_details = (req, res) => {
    let id = req.params.id;
    ProductModel.findById(id, (err, result) => {
        if(err) throw err;
        
        console.log(result);
        // Return item
        res.render('home/item-details', {
            title: 'Product Details',
            product: result
        });
    });
}
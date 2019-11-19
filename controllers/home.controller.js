const ProductModel = require('../models/products.model');
const LikedModel = require('../models/likedItems.model');

exports.home_page = (req, res) => {
    let isUser = req.user ? true : false;
    ProductModel.find({}, { strict: false }, (err, result) => {
        if(err) throw err;
        if(isUser){ // valid user
            LikedModel.find({email: req.user.email}, (err, likedItems) => {
                if(err) throw err;
                
                result.forEach(prod => {
                    prod.set('liked', false, { strict: false } );
                    likedItems.forEach(liked => {
                        if(prod._id == liked.prodId){
                            prod.set('liked', true, { strict: false } );
                        }
                    });
                });
                console.log(result);
                // Return items
                res.render('home/home-page', {
                    title: 'Music Store',
                    isUser: isUser,
                    products: result
                });
            });
        } else { // not a user
            // Return items
            res.render('home/home-page', {
                title: 'Music Store',
                isUser: isUser,
                products: result
            });
        }
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
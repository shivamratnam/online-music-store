const ProductModel = require('../models/products.model');
const UserModel = require('../models/user.model');
const CartModel = require('../models/mycart.model');

exports.home_page = (req, res) => {
    let isUser = req.user ? true : false;
    ProductModel.find({}, { strict: false }, (err, result) => {
        if(err) throw err;
        if(isUser){ // valid user
            UserModel.findOne({email: req.user.email}, (err, user) => {
                if(err) throw err;
                
                result.forEach(prod => {
                    prod.set('liked', false, { strict: false } );
                    if(user && user.likedItems.length > 0) {
                        user.likedItems.forEach(id => {
                            if(prod._id == id){
                                prod.set('liked', true, { strict: false } );
                            }
                        });
                    }
                });

                // Get number of items in the cart
                CartModel.find({email: req.user.email}, (err, cartItems) => {
                    if(err) throw err;
                    // Return items
                    res.render('home/home-page', {
                        title: 'Music Store',
                        isUser: isUser,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        products: result
                    });
                });
            });
        } else { // not a user
            // Return items
            res.render('home/home-page', {
                title: 'Music Store',
                isUser: isUser,
                likeCount: 0,
                cartCount: 0,
                products: result
            });
        }
    });
}
exports.product_details = (req, res) => {
    let id = req.params.id;
    let isUser = req.user ? true : false;
    if(isUser) {
        ProductModel.findById(id, (err, result) => {
            if(err) throw err;
            
            // Get like count
            UserModel.find({email: req.user.email}, (err, user) => {
                if(err) throw err;
    
                // Get cart count
                CartModel.find({email: req.user.email}, (err, cartItems) => {
                    if(err) throw err;
    
                    // Return item
                    res.render('home/item-details', {
                        title: 'Product Details',
                        isUser: isUser,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        product: result
                    });
                });
            });
        });
    } else {
        ProductModel.findById(id, (err, result) => {
            if(err) throw err;
            
            // Return item
            res.render('home/item-details', {
                title: 'Product Details',
                isUser: isUser,
                likeCount: 0,
                cartCount: 0,
                product: result
            });
        });
    }
}
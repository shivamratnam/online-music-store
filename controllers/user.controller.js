const UserModel = require('../models/user.model');
const OrdersModel = require('../models/orders.model');
const ProductModel = require('../models/products.model');
const CartModel = require('../models/mycart.model');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const  moment = require('moment');

exports.login_get = (req, res) => {
    let isUser = req.user ? true : false;
    res.render('user/login', {
        title: 'Login',
        isUser: isUser,
    });
}
exports.login_post = (req, res, next) => {
    let successUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
    passport.authenticate('local', {
        successRedirect: successUrl ? successUrl : '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
}
exports.signup_get = (req, res) => {
    let isUser = req.user ? true : false;
    res.render('user/signup', {
        title: 'Sign up',
        isUser: isUser
    });
}
exports.signup_post = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    UserModel.find({email: email}, (err, doc) => {
        if(err){
            console.log(err);
            res.redirect('/user/signup');
        } else {
            if(doc.length == 0){ // Unique User
                bcrypt.genSalt(10, (err, salt) => {
                    if(err){
                        console.log(err);
                        res.redirect('/user/signup');
                    } else {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if(err){
                                console.log(err);
                                res.redirect('/user/signup');
                            } else {
                                let query = {
                                    username: req.body.username,
                                    email: req.body.email,
                                    password: hash,
                                }
                                UserModel.insertMany(query, (err, doc) => {
                                    if(err){
                                        console.log(err);
                                        res.redirect('/user/signup');
                                    } else {
                                        res.redirect('/user/dashboard');
                                    }
                                });
                            }
                        });
                    } 
                });
            } else { // User already exist
                console.log('Email already exist.');
                res.redirect('/user/signup');
            }

        }
    });
}
exports.dashboard = (req, res) => {
    // Get like count
    UserModel.find({email: req.user.email}, (err, user) => {
        if(err) throw err;

        // Get cart count
        CartModel.find({email: req.user.email}, (err, cartItems) => {
            if(err) throw err;

            // Send response
            res.render('user/dashboard', {
                title: 'User Dashboard',
                isUser: true,
                username: req.user.username,
                likeCount: user.likedItems ? user.likedItems.length : 0,
                cartCount: cartItems.length
            });
        });
    });
}
exports.myOrders = (req, res) => {
    OrdersModel.find({email: req.user.email}, (err, result) => {
        if(err) throw err;

        if(result && result.length > 0){
            let orders = [];
            result.forEach(item => {
                let date = moment(item.purchaseDate).format('MMMM DD, YYYY');
                let order = {
                    prodName: item.prodName,
                    price: item.price,
                    quantity: item.quantity,
                    purchaseDate: date
                }
                orders.push(order);
            });
            // Get like count
            UserModel.find({email: req.user.email}, (err, user) => {
                if(err) throw err;

                // Get cart count
                CartModel.find({email: req.user.email}, (err, cartItems) => {
                    if(err) throw err;

                    // Send response
                    res.render('user/orders', {
                        title: 'My Orders',
                        isUser: true,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        orders: orders
                    });
                });
            });
        } else { // No Purchased Items
            // Get like count
            UserModel.find({email: req.user.email}, (err, user) => {
                if(err) throw err;

                // Get cart count
                CartModel.find({email: req.user.email}, (err, cartItems) => {
                    if(err) throw err;

                    // Send response
                    res.render('user/orders', {
                        title: 'My Orders',
                        isUser: true,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        orders: null
                    });
                });
            });
        }
    });   
}
exports.myList = (req, res) => {
    UserModel.findOne({email: req.user.email}, (err, user) => {
        if(err) throw err;

        let query = {
            _id: {
                $in: user.likedItems
            }
        }
        ProductModel.find(query, (err, products) => {
            if(err) throw err;
            
            // Get cart count
            CartModel.find({email: req.user.email}, (err, cartItems) => {
                if(err) throw err;

                if(products && products.length > 0){
                    res.render('user/liked-items', {
                        title: 'Liked Items',
                        isUser: true,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        lists: products
                    });
                } else {
                    res.render('user/liked-items', {
                        title: 'Liked Items',
                        isUser: true,
                        likeCount: user.likedItems ? user.likedItems.length : 0,
                        cartCount: cartItems.length,
                        lists: null
                    });
                }
            });
        });        
    });
}
exports.delList = (req, res) => {
    /**
     * Format of req.params.id is ( id-path )
     * path is seperated by dot(.) which we have to change to forward slash(/) 
     */
    let data = req.params.id.split('-');
    let prodId = data[0];
    redirectPath = data[1].replace(/[.]/g, '/');

    let query = {
        email: req.user.email
    }
    let udateQuery = {
        $pull: {
            likedItems: prodId
        }
    }
    UserModel.updateOne(query, udateQuery, (err, result) => {
        if(err) throw err;
        
        // Data updated
        res.redirect(redirectPath);
    });
}
exports.addList = (req, res) => {
    let prodId = req.params.id;
    let query = {
        email: req.user.email
    }
    let updateQuery = {
        $push: {
            'likedItems': prodId
        }
    }
    UserModel.updateOne(query, updateQuery, (err, raw) => {
        if(err) throw err;

        // Record Updated
        res.redirect('/');
    });
}
exports.myCart = (req, res) => {
    CartModel.find({email: req.user.email}, (err, cartItems) => {
        if(err) throw err;
        let myCart = [];
        ProductModel.find({}, (err, prodList) => {
            if(err) throw err;
            let itemLen = cartItems.length;
            let prodLen = prodList.length;
            for(let i = 0; i < prodLen; i++){ // products
                let quantity = 0;
                for(let j = 0 ; j < itemLen; j++){ // cart items
                    if(prodList[i]._id == cartItems[j].prodId){
                        quantity++;
                        if(quantity == 1) myCart.push(prodList[i]);
                    }
                }
                prodList[i].quantity = quantity;
            }
            // Get like count
            UserModel.find({email: req.user.email}, (err, user) => {
                if(err) throw err;

                // Send response
                res.render('user/my-cart', {
                    title: 'My Cart',
                    isUser: true,
                    likeCount: user.likedItems ? user.likedItems.length : 0,
                    cartCount: cartItems.length,
                    items: myCart
                });
            });
        });
    });
}
exports.addToCart = (req, res) => {
    /**
     * Format of req.params.id is ( id-path )
     * path is seperated by dot(.) which we have to change to forward slash(/) 
     */
    let data = req.params.id.split('-');
    let prodId = data[0];
    redirectPath = data[1].replace(/[.]/g, '/');

    let query = {
        email: req.user.email,
        prodId: prodId
    }
    CartModel.insertMany(query, (err, result) => {
        if(err) throw err;
        
        // Data Inserted Successfully.
        res.redirect(redirectPath);
    });
}
exports.removeFromCart = (req, res) => {
    let prodId = req.params.id;
    CartModel.findOneAndDelete({prodId: prodId}, (err, result) => {
        if(err) throw err;

        // Item removed
        res.redirect('/user/cart');
    });
}
exports.myProfile = (req, res) => {
    UserModel.findById(req.user._id, (err, result) => {
        if(err) throw err;
        
        // Get cart count
        CartModel.find({email: req.user.email}, (err, cartItems) => {
            if(err) throw err;

            let profile = {
                name: result.username,
                email: result.email,
                gender: result.gender ? result.gender : ''
            }
            // Send response
            res.render('user/profile', {
                title: 'My Profile',
                isUser: true,
                likeCount: result.likedItems ? result.likedItems.length : 0,
                cartCount: cartItems.length,
                profile: profile,
            });
        });
    });
}
exports.settings = (req, res) => {
    // Get like count
    UserModel.find({email: req.user.email}, (err, user) => {
        if(err) throw err;

        // Get cart count
        CartModel.find({email: req.user.email}, (err, cartItems) => {
            if(err) throw err;

            // Send response
            res.render('user/settings', {
                title: 'My Settings',
                isUser: true,
                likeCount: user.likedItems ? user.likedItems.length : 0,
                cartCount: cartItems.length
            });
        });
    });
}

exports.buyProd = (req, res) => {
    let idWithQty = req.params.ids.split(',');
    let ids = [];
    let idMapper = [];
    idWithQty.forEach(item => {
        let temp = [];
        let temp1 = {}

        // array of ids
        temp = item.split('-');
        ids.push(temp[0]);

        // array of objects with id & quantity
        temp1.id = temp[0];
        temp1.quantity = parseInt(temp[1]);
        idMapper.push(temp1);
    });
    let query = {
        '_id': {
            '$in': ids
        }
    }
    ProductModel.find(query, (err, result) => {
        if(err) throw err;
        let query = [];
        result.forEach( product => {
            idMapper.forEach( element => {
                if(product._id == element.id){
                    let order = {
                        email: req.user.email,
                        prodId: product._id,
                        prodName: product.prodName,
                        price: product.price,
                        quantity: element.quantity,
                        purchaseDate: new Date()
                    }
                    query.push(order);
                }
            });
        });
        OrdersModel.insertMany(query, (err, result) => {
            if(err) throw err;

            //remove items from the cart
            CartModel.remove({}, (err, result) => {
                if(err) throw err;

                // Items successfully removed from the cart;
                
                //Record Inserted
                res.redirect('/user/booked');
            });
        });
    });
}
exports.bookingConfirmation = (req, res) => {
    // Get like count
    UserModel.find({email: req.user.email}, (err, user) => {
        if(err) throw err;

        // Get cart count
        CartModel.find({email: req.user.email}, (err, cartItems) => {
            if(err) throw err;

            // Send response
            res.render('user/booking-confirmation', {
                title: 'Booking Confirmation',
                isUser: true,
                confirmationMsg: 'Product purchased successfully',
                likeCount: user.likedItems ? user.likedItems.length : 0,
                cartCount: cartItems.length
            });
        });
    });
}
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}
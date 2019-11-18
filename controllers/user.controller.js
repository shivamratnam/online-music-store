const UserModel = require('../models/user.model');
const OrdersModel = require('../models/orders.model');
const ProductModel = require('../models/products.model');
const LikedModel = require('../models/likedItems.model');
const CartModel = require('../models/mycart.model');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const  moment = require('moment');

exports.login_get = (req, res) => {
    res.render('user/login', {
        title: 'Login',
        isUser: false,
        errors: [{
            msg: 'ERR1'
        },{
            msg: 'ERR2'
        }]
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
    res.render('user/signup', {
        title: 'Sign up',
        isUser: false
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
    res.render('user/dashboard', {
        title: 'Dashboard',
        isUser: true,
        username: req.user.username
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
                    purchaseDate: date
                }
                orders.push(order);
            });
            
            res.render('user/orders', {
                title: 'My Orders',
                isUser: true,
                orders: orders
            });
        } else { // No Purchased Items
            res.render('user/orders', {
                title: 'My Orders',
                isUser: true,
                orders: null
            });
        }
    });   
}
exports.myList = (req, res) => {
    LikedModel.find({email: req.user.email}, (err, result) => {
        if(err) throw err;
        if(result && result.length > 0){
            let lists = [];
            result.forEach(item => {
                let list = {
                    _id: item._id,
                    prodId: item.prodId,
                    prodName: item.prodName,
                    price: item.price
                }
                lists.push(list);
            });
            res.render('user/liked-items', {
                title: 'Liked Items',
                isUser: true,
                lists: lists
            });
        } else { // No Purchased Items
            res.render('user/liked-items', {
                title: 'Liked Items',
                isUser: true,
                lists: null
            });
        }
    });
}
exports.delList = (req, res) => {
    let id = req.params.id;
    console.log(id);
    LikedModel.findByIdAndDelete(id, (err, result) => {
        if(err) throw err;

        res.redirect('/user/mylist');
    });
}
exports.addList = (req, res) => {
    let prodId = req.params.id;
    ProductModel.findById(prodId, (err, result) => {
        if(err) throw err;
        
        let likedItem = {
            email: req.user.email,
            prodId: result._id,
            prodName: result.prodName,
            price: result.price
        }
        LikedModel.insertMany(likedItem, (err, result)=> {
            if(err) throw err;

            // Inserted successfully
            res.send('Added to my list');
        });
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
            res.render('user/my-cart', {
                title: 'My Cart',
                isUser: true,
                items: myCart
            });
        });
    });
}
exports.addToCart = (req, res) => {
    let prodId = req.params.id;
    let query = {
        email: req.user.email,
        prodId: prodId
    }
    CartModel.insertMany(query, (err, result) => {
        if(err) throw err;
        
        // Data Inserted Successfully.
        res.redirect('/user/cart');
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
        
        // Return Profile
        let profile = {
            name: result.username,
            email: result.email,
            gender: result.gender ? result.gender : ''
        }
        console.log(profile);
        res.render('user/profile', {
            title: 'My Profile',
            isUser: true,
            profile: profile,
        });
    });
}
exports.settings = (req, res) => {
    res.render('user/settings', {
        title: 'My Settings',
        isUser: true
    });
}

exports.buyProd = (req, res) => {
    let id = req.params.id
    console.log(id);
    ProductModel.findById(id, (err, result) => {
        if(err) throw err;
        
        let date = new Date();
        console.log(date);
        let order = {
            email: req.user.email,
            prodId: id,
            prodName: result.prodName,
            price: result.price,
            purchaseDate: date
        }
        OrdersModel.insertMany(order, (err, result) => {
            if(err) throw err;

            //Record Inserted
            res.redirect('/user/booked');
        });
    });
}
exports.bookingConfirmation = (req, res) => {
    res.render('user/booking-confirmation', {
        title: 'Booking Confirmation',
        isUser: true,
        confirmationMsg: 'Product purchased successfully'
    });
}
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}
const UserModel = require('../models/user.model');
const OrdersModel = require('../models/orders.model');
const LikedModel = require('../models/likedItems.model');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const  moment = require('moment');

exports.login_get = (req, res) => {
    res.render('user/login', {
        title: 'Login',
        errors: [{
            msg: 'ERR1'
        },{
            msg: 'ERR2'
        }]
    });
}
exports.login_post = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
}
exports.signup_get = (req, res) => {
    res.render('user/signup', {
        title: 'Sign up'
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
        title: 'Dashboard'
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
                orders: orders
            });
        } else { // No Purchased Items
            res.render('user/orders', {
                title: 'My Orders',
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
                    prodName: item.prodName,
                    price: item.price
                }
                lists.push(list);
            });
            res.render('user/liked-items', {
                title: 'Liked Items',
                lists: lists
            });
        } else { // No Purchased Items
            res.render('user/liked-items', {
                title: 'Liked Items',
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
exports.myCart = (req, res) => {
    res.send("<h1>My Cart</h1>");
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
            profile: profile,
        });
    });
}
exports.settings = (req, res) => {
    res.render('user/settings', {
        title: 'My Settings'
    });
}
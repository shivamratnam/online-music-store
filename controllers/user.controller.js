const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.login_get = (req, res) => {
    res.render('user/login', {
        title: 'Login'
    });
}
exports.login_post = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    UserModel.findOne({email: email}, (err, doc) => {
        if(err){
            console.log(err);
            res.redirect('/user/login');
        } else {
            bcrypt.compare(password, doc.password, (err, success) => {
                if(err){
                    console.log(err);
                    res.redirect('/user/login');
                } else {
                    if(success){
                        console.log('login success');
                        res.redirect('/user/dashboard');
                    } else {
                        console.log('invalid email or password');
                        res.redirect('/user/login');
                    }
                }
            });
        }
    });
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
    })
}
exports.dashboard = (req, res) => {
    res.render('user/dashboard', {
        title: 'Dashboard'
    });
}
exports.myOrders = (req, res) => {
    res.render('user/orders', {
        title: 'My Orders'
    });
}
exports.likedItems = (req, res) => {
    res.render('user/liked-items', {
        title: 'Liked Items'
    });
}
exports.myCart = (req, res) => {
    res.send("<h1>My Cart</h1>");
}
exports.myProfile = (req, res) => {
    res.render('user/profile', {
        title: 'My Profile'
    });
}
exports.settings = (req, res) => {
    res.render('user/settings', {
        title: 'My Settings'
    });
}
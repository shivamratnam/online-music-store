const express = require('express');
const userController = require('../controllers/user.controller');
const { ensureAuthenticated } = require('../authentication/auth');

// Init route
const route = express.Router();

route.get('/dashboard', ensureAuthenticated, userController.dashboard);
route.get('/login', userController.login_get);
route.get('/signup', userController.signup_get);
route.get('/profile', ensureAuthenticated, userController.myProfile);
route.get('/cart', ensureAuthenticated, userController.myCart);
route.get('/cart/:id', ensureAuthenticated, userController.addToCart);
route.get('/cart/delete/:id', ensureAuthenticated, userController.removeFromCart);
route.get('/orders', ensureAuthenticated, userController.myOrders);
route.get('/mylist', ensureAuthenticated, userController.myList);
route.get('/mylist/delete/:id', ensureAuthenticated, userController.delList);
route.get('/mylist/add/:id', ensureAuthenticated, userController.addList);
route.get('/settings', ensureAuthenticated, userController.settings);

route.get('/buy/:id', ensureAuthenticated, userController.buyProd);
route.get('/booked', ensureAuthenticated, userController.bookingConfirmation);

route.post('/login', userController.login_post);
route.post('/signup', userController.signup_post);
route.get('/logout', userController.logout);



module.exports = route;

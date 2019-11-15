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
route.get('/orders', ensureAuthenticated, userController.myOrders);
route.get('/mylist', ensureAuthenticated, userController.myList);
route.get('/mylist/:id', ensureAuthenticated, userController.delList);
route.get('/settings', ensureAuthenticated, userController.settings);

route.post('/login', userController.login_post);
route.post('/signup', userController.signup_post);


module.exports = route;

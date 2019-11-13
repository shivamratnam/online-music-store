const express = require('express');
const userController = require('../controllers/user.controller');

// Init route
const route = express.Router();

route.get('/dashboard', userController.dashboard);
route.get('/login', userController.login_get);
route.get('/signup', userController.signup_get);
route.get('/profile', userController.myProfile);
route.get('/cart', userController.myCart);
route.get('/orders', userController.myOrders);
route.get('/settings', userController.settings);

route.post('/login', userController.login_post);
route.post('/signup', userController.signup_post);


module.exports = route;

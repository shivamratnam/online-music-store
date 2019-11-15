const express = require('express');
const homeController = require('../controllers/home.controller');

// Init route
const route = express.Router();

route.get('/', homeController.home_page);
route.get('/details/:id', homeController.product_details);


module.exports = route;

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./database/db.config');
const homeRoute = require('./routes/home.route');
const userRoute = require('./routes/users.route');

// Init app
const app = express();

// Init views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// Route paths
app.use('/', homeRoute);
app.use('/user', userRoute);

// Connect to the database
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(dbConfig.DB_URI, options, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log('Database Connected');
    }
});

// Starting point of the app
(() => {
    let port = process.env.PORT || 8080;
    // Start the server
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
})();

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// User Model
const UserModel = require('../models/user.model');

module.exports = function(passport) {
    let options = {
        usernameField: 'email'
    }
    passport.use(new LocalStrategy(options, (email, password, done) => {
        // Match User
        let query = {
            email: email
        }
        UserModel.findOne(query)
        .then(user => {
            if(!user){
                return done(null, false, {message: 'Email is not registered'});
            }
            // Match Password
            bcrypt.compare(password, user.password, (err, success) => {
                if(err) throw err;

                if(success){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Password'});
                }
            });
        })
        .catch(err => console.log(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
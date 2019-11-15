module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            console.log('true');
            return next();
        } else {
            console.log('false');
            res.redirect('/user/login');
        }
    }
}
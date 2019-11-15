module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        } else {
            req.session.redirectUrl = req.originalUrl;
            res.redirect('/user/login');
        }
    }
}
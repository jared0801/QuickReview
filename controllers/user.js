const passport = require('passport');
const User = require('../models/user');

module.exports = {
    /* POST /users/register */
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        })

        await User.register(newUser, req.body.password);
        res.redirect('/');
    },
    /* POST /users/login */
    postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login'
        })(req, res, next);
    },
    /* GET /users/logout */
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}
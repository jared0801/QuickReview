const passport = require('passport');
const User = require('../models/user');
const { ErrorMsg, SuccessMsg } = require('../messages');

module.exports = {
    /* GET /users/register */
    getRegister(req, res, next) {
        if(req.isAuthenticated()) return res.redirect('/');
        res.render('register', { title: 'Register', username: '', email: '' });
    },
    /* POST /users/register */
    async postRegister(req, res, next) {
        try {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                image: req.body.image
            });
            const user = await User.register(newUser, req.body.password);
            req.login(user, function(err) {
                if(err) return next(err);
                
                req.session.success = SuccessMsg.WELCOME_USER(user.username);
                res.redirect('/');
            });
        } catch(err) {
            const { username, email } = req.body;
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email')) {
                error = ErrorMsg.USER_EMAIL_TAKEN;
            }
            res.render('register', { title: 'Register', username, email, error });
        }
    },
    /* GET /users/login */
    getLogin(req, res, next) {
        if(req.isAuthenticated()) return res.redirect('/');
        if(req.query.returnTo) {
            req.session.redirectTo = req.headers.referer;
        }
        res.render('login', { title: 'Login' });
    },
    /* POST /users/login */
    async postLogin(req, res, next) {
        const { username, password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        if(!user && error) return next(error);
        req.login(user, function(err) {
            if(err) return next(err);
            req.session.success = SuccessMsg.WELCOME_BACK_USER(username);
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
    },
    /* GET /users/logout */
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}
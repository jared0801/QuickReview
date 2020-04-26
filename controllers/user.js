const User = require('../models/user');
const Deck = require('../models/deck');
const { ErrorMsg, SuccessMsg } = require('../messages');
const util = require('util');

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
    },
    /* GET /users/profile */
    async getProfile(req, res, next) {
        const decks = await Deck.find().where('author').equals(req.user._id).limit(10).exec();
        res.render('profile', { decks });
    },
    async updateProfile(req, res, next) {
        const {
            username,
            email
        } = req.body;
        const { user } = res.locals;
        if(username) user.username = username;
        if(email) user.email = email;
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.session.success = SuccessMsg.PROFILE_UPDATED;
        res.redirect('/users/profile');
    }
}
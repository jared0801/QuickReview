const Review = require('../models/review');
const Deck = require('../models/deck');
const User = require('../models/user');
const { ErrorMsg } = require('../messages');

module.exports = {
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                   .catch(next);
        },
    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = ErrorMsg.REVIEW_UPDATE_AUTH;
        return res.redirect('/')
    },
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.error = ErrorMsg.USER_NOT_LOGGED_IN;
        req.session.redirectTo = req.originalUrl;
        res.redirect('/users/login');
    },
    isAuthor: async (req, res, next) => {
        const deck = await Deck.findById(req.params.id);
        if (deck.author.equals(req.user._id)) {
            res.locals.deck = deck;
            return next();
        }
        req.session.error = ErrorMsg.USER_NOT_AUTHOR;
        res.redirect('back');
    },
    isValidPassword: async (req, res, next) => {
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
        if(user) {
            // Add user to res.locals
            res.locals.user = user;
            next();
        } else {
            req.sesion.error = ErrorMsg.PROFILE_INCORRECT_PASSWORD;
            return res.redirect('/users/profile');
        }
    },
    changePassword: async (req, res, next) => {
        const {
            newPassword,
            passwordConfirmation
        } = req.body;

        if(newPassword && !passwordConfirmation) {
            req.session.error = ErrorMsg.PROFILE_NO_PASS_CONF;
            return res.redirect('/users/profile');
        }
        else if(newPassword && passwordConfirmation) {
            const { user } = res.locals;
            if(newPassword === passwordConfirmation) {
                await user.setPassword(newPassword);
                next();
            } else {
                req.session.error = ErrorMsg.PROFILE_NEW_PASS_CONF;
                return res.redirect('/users/profile');
            }
        } else {
            next();
        }
    }
}
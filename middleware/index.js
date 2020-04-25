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
    },/*
    checkIfUserExists: async (req, res, next) => {
        let userExists = await User.findOne({ 'email': req.body.email });
        if(userExists) {
            req.session.error = "A user with the given email is already registered.";
            return rers.redirect('back');
        }
        next();
    }*/
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.error = "You need to be logged in to do that!";
        req.session.redirectTo = req.originalUrl;
        res.redirect('/users/login');
    },
    isAuthor: async (req, res, next) => {
        const deck = await Deck.findById(req.params.id);
        if (deck.author.equals(req.user._id)) {
            res.locals.deck = deck;
            return next();
        }
        req.session.error = "Access denied.";
        res.redirect('back');
    }
}
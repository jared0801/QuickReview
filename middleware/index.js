const Review = require('../models/review');
const Deck = require('../models/deck');
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
    }
}
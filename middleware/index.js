const Review = require('../models/review');
const Deck = require('../models/deck');
const User = require('../models/user');
const { ErrorMsg } = require('../messages');
const { cloudinary } = require('../cloudinary');

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const middleware = {
    asyncErrorHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                   .catch(next);
        }
    },
    async isReviewAuthor(req, res, next) {
        let review = await Review.findById(req.params.review_id);
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = ErrorMsg.REVIEW_UPDATE_AUTH;
        return res.redirect('/')
    },
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) return next();
        req.session.error = ErrorMsg.USER_NOT_LOGGED_IN;
        req.session.redirectTo = req.originalUrl;
        res.redirect('/users/login');
    },
    async isAuthor(req, res, next) {
        const deck = await Deck.findById(req.params.id);
        if (deck.author.equals(req.user._id)) {
            res.locals.deck = deck;
            return next();
        }
        req.session.error = ErrorMsg.USER_NOT_AUTHOR;
        res.redirect('back');
    },
    async isValidPassword(req, res, next) {
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
        if(user) {
            // Add user to res.locals
            res.locals.user = user;
            next();
        } else {
            await middleware.deleteProfileImage(req);
            req.session.error = ErrorMsg.PROFILE_INCORRECT_PASSWORD;
            return res.redirect('/users/profile');
        }
    },
    async changePassword(req, res, next) {
        const {
            newPassword,
            passwordConfirmation
        } = req.body;

        if(newPassword && !passwordConfirmation) {
            await middleware.deleteProfileImage(req);
            req.session.error = ErrorMsg.PROFILE_NO_PASS_CONF;
            return res.redirect('/users/profile');
        }
        else if(newPassword && passwordConfirmation) {
            const { user } = res.locals;
            if(newPassword === passwordConfirmation) {
                await user.setPassword(newPassword);
                next();
            } else {
                await middleware.deleteProfileImage(req);
                req.session.error = ErrorMsg.PROFILE_NEW_PASS_CONF;
                return res.redirect('/users/profile');
            }
        } else {
            next();
        }
    },
    async deleteProfileImage(req) {
        if(req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
    },
    async searchAndFilterDecks(req, res, next) {
        const queryKeys = Object.keys(req.query);
        const publicDbQueries = [{ public: true }];
        const privateDbQueries = [];

        if(queryKeys.length) {
            let { search, avgRating } = req.query;

            if(search) {
                search = new RegExp(escapeRegExp(search), 'gi');
                publicDbQueries.push({ $or: [
                    { title: search },
                    { description: search },
                    { subjects: { $all: [search] } }
                ]});
                privateDbQueries.push({ $or: [
                    { title: search },
                    { description: search },
                    { subjects: { $all: [search] } }
                ]});
            }
            if(avgRating) {
                publicDbQueries.push({ avgRating: { $in: avgRating }});
                privateDbQueries.push({ avgRating: { $in: avgRating }});
            }
        }
        res.locals.publicDbQuery = publicDbQueries.length ? { $and: publicDbQueries } : publicDbQueries[0];
        res.locals.privateDbQuery = privateDbQueries.length ? { $and: privateDbQueries } : {};

        res.locals.query = req.query;

        const pageIndex = queryKeys.indexOf('page');
        if(pageIndex !== -1) {
            queryKeys.splice(pageIndex, 1);
        }
        const delimiter = queryKeys.length ? '&' : '?';
        res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;

        next();
    }
}

module.exports = middleware;
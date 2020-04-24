const Deck = require('../models/deck');
const Review = require('../models/review');
const { ErrorMsg, SuccessMsg } = require('../messages');

module.exports = {
    /* POST reviews create /decks/:id/reviews */
    async reviewCreate(req, res, next) {
        try {
            // find the deck by id
            let deck = await Deck.findById(req.params.id);
            try {
                // create the review
                req.body.review.author = req.user._id;
                req.body.review.created = new Date();
                let review = await Review.create(req.body.review);
                // assign review to the deck
                deck.reviews.push(review);
                // save the deck
                deck.save();
                // redirect to the deck
                req.session.success = SuccessMsg.REVIEW_CREATED;
                res.redirect(`/decks/${deck.id}`);
            } catch(e) {
                throw new Error(ErrorMsg.REVIEW_NOT_CREATED);
            }
        } catch(e) {
            throw new Error(ErrorMsg.DECK_NOT_FOUND);
        }
        
        
    },
    /* PUT reviews update /decks/:id/reviews/:review_id */
    async reviewUpdate(req, res, next) {
        try {
            await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
            req.session.success = SuccessMsg.REVIEW_UPDATED;
            res.redirect(`/decks/${req.params.id}`);
        } catch(e) {
            throw new Error(ErrorMsg.REVIEW_NOT_FOUND);
        }
    },
    /* DELETE reviews destroy /decks/:id/reviews/:review_id */
    async reviewDestroy(req, res, next) {
        
    }
}
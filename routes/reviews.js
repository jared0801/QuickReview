const express = require('express');
// mergeParams allows us to access the deck id as well as review_id
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {
  reviewCreate,
  reviewUpdate,
  reviewDestroy
} = require('../controllers/reviews');

/*
POST create     /decks/:id/reviews
PUT update      /decks/:id/reviews/:review_id
DELETE destroy  /decks/:id/reviews/:review_id
*/

/* POST reviews create /decks/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews update /decks/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE reviews destroy /decks/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));

module.exports = router;

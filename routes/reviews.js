const express = require('express');
const router = express.Router({ mergeParams: true });

/*
GET index       /decks/:id/reviews
POST create     /decks/:id/reviews
GET edit        /decks/:id/reviews/:review_id/edit
PUT update      /decks/:id/reviews/:review_id
DELETE destroy  /decks/:id/reviews/:review_id
*/

/* GET reviews index /decks/:id/reviews */
router.get('/', (req, res, next) => {
  res.send('INDEX /decks/:id/reviews');
});

/* POST reviews create /decks/:id/reviews */
router.post('/', (req, res, next) => {
  res.send('CREATE /decks/:id/reviews');
});

/* GET reviews edit /decks/:id/reviews/:review_id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('POST /decks/:id/reviews/:review_id/edit');
});

/* PUT reviews update /decks/:id/reviews/:review_id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /decks/:id/reviews/:review_id');
});

/* DELETE reviews destroy /decks/:id/reviews/:review_id */
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /decks/:id/reviews/:review_id');
});

module.exports = router;

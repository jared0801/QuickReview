const express = require('express');
const router = express.Router({ mergeParams: true });

/*
GET index       /decks/:id/cards
POST create     /decks/:id/cards
GET edit        /decks/:id/cards/:card_id/edit
PUT update      /decks/:id/cards/:card_id
DELETE destroy  /decks/:id/cards/:card_id
*/

/* GET cards index /decks/:id/cards */
router.get('/', (req, res, next) => {
  res.send('INDEX /decks/:id/cards');
});

/* POST cards create /decks/:id/cards */
router.post('/', (req, res, next) => {
  res.send('CREATE /decks/:id/cards');
});

/* GET cards edit /decks/:id/cards/:card_id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('POST /decks/:id/cards/:card_id/edit');
});

/* PUT cards update /decks/:id/cards/:card_id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /decks/:id/cards/:card_id');
});

/* DELETE cards destroy /decks/:id/cards/:card_id */
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /decks/:id/cards/:card_id');
});

module.exports = router;

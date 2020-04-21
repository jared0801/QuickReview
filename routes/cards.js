const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler } = require('../middleware');
const { 
  cardNew, 
  cardCreate, 
  cardEdit, 
  cardUpdate,
  cardDestroy
} = require('../controllers/cards');

/*
//GET index       /decks/:id/cards
GET create      /decks/:id/cards/new
POST create     /decks/:id/cards
GET edit        /decks/:id/cards/:card_id/edit
PUT update      /decks/:id/cards/:card_id
DELETE destroy  /decks/:id/cards/:card_id
*/

/* GET cards index /decks/:id/cards */
//router.get('/', asyncErrorHandler(getCards));

/* POST cards create /decks/:id/cards/new */
router.get('/new', cardNew);

/* POST decks create /decks/:id/cards */
router.post('/', asyncErrorHandler(cardCreate));

/* GET cards edit /decks/:id/cards/:card_id/edit */
router.get('/:card_id/edit', asyncErrorHandler(cardEdit));

/* PUT cards update /decks/:id/cards/:card_id */
router.put('/:card_id', asyncErrorHandler(cardUpdate));

/* DELETE cards destroy /decks/:id/cards/:card_id */
router.delete('/:card_id', asyncErrorHandler(cardDestroy));

module.exports = router;

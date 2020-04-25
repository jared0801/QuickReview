const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
  asyncErrorHandler,
  isLoggedIn,
  isAuthor
} = require('../middleware');
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
router.get('/new', isLoggedIn, asyncErrorHandler(isAuthor), cardNew);

/* POST decks create /decks/:id/cards */
router.post('/', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('image', 1), asyncErrorHandler(cardCreate));

/* GET cards edit /decks/:id/cards/:card_id/edit */
router.get('/:card_id/edit', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(cardEdit));

/* PUT cards update /decks/:id/cards/:card_id */
router.put('/:card_id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('image', 1), asyncErrorHandler(cardUpdate));

/* DELETE cards destroy /decks/:id/cards/:card_id */
router.delete('/:card_id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(cardDestroy));

module.exports = router;

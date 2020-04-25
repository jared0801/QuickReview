const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
  asyncErrorHandler,
  isLoggedIn,
  isAuthor
} = require('../middleware');

const { 
  deckIndex, 
  deckNew, 
  deckCreate, 
  deckShow,
  deckEdit,
  deckUpdate,
  deckDestroy
} = require('../controllers/decks');

/*
GET index       /decks
GET new         /decks/new
POST create     /decks
GET show        /decks/:id
GET edit        /decks/:id/edit
PUT update      /decks/:id
DELETE destroy  /decks/:id
*/

/* GET decks index /decks */
router.get('/', asyncErrorHandler(deckIndex));

/* GET decks new /decks/new */
router.get('/new', isLoggedIn, deckNew);

/* POST decks create /decks */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(deckCreate));

/* GET decks show /decks/:id */
router.get('/:id', asyncErrorHandler(deckShow));

/* GET decks edit /decks/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), deckEdit);

/* PUT decks update /decks/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(deckUpdate));

/* DELETE decks destroy /decks/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(deckDestroy));

module.exports = router;

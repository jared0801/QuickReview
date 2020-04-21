const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ 'dest': 'uploads/' });
const { asyncErrorHandler } = require('../middleware');
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
router.get('/new', deckNew);

/* POST decks create /decks */
router.post('/', upload.array('images', 4), asyncErrorHandler(deckCreate));

/* GET decks show /decks/:id */
router.get('/:id', asyncErrorHandler(deckShow));

/* GET decks edit /decks/:id/edit */
router.get('/:id/edit', asyncErrorHandler(deckEdit));

/* PUT decks update /decks/:id */
router.put('/:id', asyncErrorHandler(deckUpdate));

/* DELETE decks destroy /decks/:id */
router.delete('/:id', asyncErrorHandler(deckDestroy));

module.exports = router;

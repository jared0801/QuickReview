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
  deckTest,
  deckReview,
  deckIndex, 
  deckNew, 
  deckCreate, 
  deckShow,
  deckEdit,
  deckUpdate,
  deckDestroy
} = require('../controllers/decks');


/* GET decks index /decks */
router.get('/', asyncErrorHandler(deckIndex));

/* GET decks new /decks/new */
router.get('/new', isLoggedIn, deckNew);

/* POST decks create /decks */
router.post('/', isLoggedIn, upload.single('image'), asyncErrorHandler(deckCreate));

/* GET decks show /decks/:id */
router.get('/:id', asyncErrorHandler(deckShow));

/* GET decks review /decks/:id/review */
router.get('/:id/review', asyncErrorHandler(deckReview));

/* GET decks test /decks/:id/test */
router.get('/:id/test', asyncErrorHandler(deckTest));

/* GET decks edit /decks/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), deckEdit);

/* PUT decks update /decks/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.single('image'), asyncErrorHandler(deckUpdate));

/* DELETE decks destroy /decks/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(deckDestroy));

module.exports = router;

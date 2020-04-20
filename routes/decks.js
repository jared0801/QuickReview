const express = require('express');
const router = express.Router();

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
router.get('/', (req, res, next) => {
  res.send('INDEX /decks');
});

/* GET decks new /decks/new */
router.get('/new', (req, res, next) => {
  res.send('GET /decks/new');
});

/* POST decks create /decks */
router.post('/', (req, res, next) => {
  res.send('CREATE /decks');
});

/* GET decks show /decks/:id */
router.get('/:id', (req, res, next) => {
  res.send('SHOW /decks/:id');
});

/* GET decks edit /decks/:id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('POST /decks/:id/edit');
});

/* PUT decks update /decks/:id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /decks/:id');
});

/* DELETE decks destroy /decks/:id */
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /decks/:id');
});

module.exports = router;

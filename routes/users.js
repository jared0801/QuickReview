const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getLogout } = require('../controllers/user');
const { asyncErrorHandler } = require('../middleware');

/* GET /users/register */
router.get('/register', (req, res, next) => {
  res.send('GET /users/register');
});

/* POST /users/register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /users/login */
router.get('/login', (req, res, next) => {
  res.send('GET /users/login');
});

/* POST /users/login */
router.post('/login', postLogin);

/* GET /users/logout */
router.get('/logout', getLogout);

/* GET /users/profile */
router.get('/profile', (req, res, next) => {
  res.send('GET /users/profile');
});

/* PUT /users/profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('UPDATE /users/profile/:user_id');
});

/* GET /users/forgot */
router.get('/forgot', (req, res, next) => {
  res.send('GET /users/forgot');
});

/* PUT /users/forgot */
router.put('/forgot', (req, res, next) => {
  res.send('UPDATE /users/forgot');
});

/* GET /users/reset/:token */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /users/reset/:token');
});

/* PUT /users/reset/:token */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /users/reset/:token');
});

module.exports = router;

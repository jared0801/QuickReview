const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
  postRegister, 
  postLogin, 
  getLogout, 
  getLogin, 
  getRegister,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset
} = require('../controllers/user');
const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware');

/* GET /users/register */
router.get('/register', getRegister);

/* POST /users/register */
router.post('/register',
  upload.single('image'),
  asyncErrorHandler(postRegister)
);

/* GET /users/login */
router.get('/login', getLogin);

/* POST /users/login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /users/logout */
router.get('/logout', getLogout);

/* GET /users/profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /users/profile */
router.put('/profile',
  isLoggedIn,
  upload.single('image'),
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/* GET /users/forgot */
router.get('/forgot-password', getForgotPw);

/* PUT /users/forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /users/reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /users/reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;

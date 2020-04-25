
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const SeedDecks = require('./seeds');
// SeedDecks();

// Require models
const User = require('./models/user');

// Require routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');
const reviewsRouter = require('./routes/reviews');

const app = express();

// Connect to the database
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Succesfully connected to the database.")
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configure session
app.use(session({
  secret: 'hang ten dude',
  resave: false,
  saveUninitialized: true
}));

// Configure passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set local variables middleware
app.use((req, res, next) => {

  /*if(process.env.NODE_ENV === 'development') {
    req.user = {
      '_id': '5e9f3c4838c792294022388b',
      'username': 'jared2'
    }
  }*/
  res.locals.currentUser = req.user;

  // Set page title
  res.locals.title = "Quick Review";

  // Set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;

  // Set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;

  next();
});

// Mount routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/decks', decksRouter);
app.use('/decks/:id/cards', cardsRouter);
app.use('/decks/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(req.url);
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;

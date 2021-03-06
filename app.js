const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const listsRouter = require('./routes/lists');
const tasksRouter = require('./routes/tasks');
const {restoreUser, loginUser, logoutUser} = require('./auth')
const { sessionSecret } = require('./config')

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/scripts', listscripts);


// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: sessionSecret,
    store,
    saveUninitialized: false,
    resave: false,
    expires: new Date(Date.now()+ (10 * 60 * 1000)), //10 minute expiration

  })
);

// create Session table if it doesn't already exist
store.sync();

// restore
app.use(restoreUser)

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);
app.use('/tasks', tasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(err.message)
  // console.log(sessionSecret)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

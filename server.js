const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const createError = require('http-errors');
const mailer = require('express-mailer');
const Csurf = require('csurf');
const session = require('express-session');
const connectRedis = require('connect-redis');
const passport = require('passport');
const passportLocal = require('passport-local');
const auth = require('./app/authentication');

const app = express();
const RedisStore = connectRedis(session);
const LocalStrategy = passportLocal.Strategy;

/***************************************************** config */
const config_core = require('./config/core.js');
const config_mail = require('./config/mail.js');

/***************************************************** pug */
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

/***************************************************** mailer */
mailer.extend(app, config_mail);

/***************************************************** middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config_core.cookieSecret));
app.use(flash());

/***************************************************** passport */
auth.init(app);

app.use(session({
  secret: config_core.expressSession.secret,
  name: config_core.expressSession.name,
  resave: config_core.expressSession.resave,
  saveUninitialized: config_core.expressSession.saveUninitialized,
  store: new RedisStore({ host: 'localhost', port: 6480, ttl: 86400 }),
}));

app.use(passport.initialize());
app.use(passport.session());

/***************************************************** CSURF FLASH */
var csurf = Csurf();
app.use(csurf);

app.use(function(req, res, next){
  res.locals._csrfToken = req.csrfToken();
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

/***************************************************** BL */
require('./app/index.route').mountRoutes(app);
require('./app/user').init(app)
require('./app/note').init(app)

/***************************************************** 404 */
app.use(function(req, res, next) {
  next(createError(404));
});

/***************************************************** 500 */
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('view_errorpage');
});

module.exports = app;

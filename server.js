const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const createError = require('http-errors');
const mailer = require('express-mailer');
const Csurf = require('csurf');
const passport = require('passport');
const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);

/***************************************************** config */
const config_core = require('./config/core.js');
const config_mail = require('./config/mail.js');

/***************************************************** pug */
app.set('views', path.join(__dirname, 'app'));
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
require('./app/authentication').init(app);
// setting https://habr.com/ru/post/435106/

app.use(session({
  secret: config_core.expressSession.secret,
  //name: config_core.expressSession.name,
  resave: config_core.expressSession.resave,
  saveUninitialized: config_core.expressSession.saveUninitialized,
  store: new RedisStore(config_core.redis),
}));

app.use(passport.initialize());
app.use(passport.session());

/***************************************************** CSURF */
var csurf = Csurf();
app.use(csurf);

app.use(function(req, res, next){
  res.locals._csrfToken = req.csrfToken();
  next();
});

/***************************************************** BL */
app.get('/', function(req, res){
  res.render('./views/main');
});
require('./app/registration').router(app);
require('./app/user').router(app);
require('./app/reglink').router(app);
require('./app/authentication').router(app);
require('./app/start').router(app);
require('./app/main').router(app);

require('./app/upload').router(app);

/***************************************************** 404 */
app.use(function(req, res, next) {
  next(createError(404));
});

/***************************************************** 500 */
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('./views/errorpage');

});

module.exports = app;

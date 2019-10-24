const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authenticationMiddleware = require('./middleware');
const userModel = require("../user/model");

async function findUser (username, callback) {

  var User = new userModel.User(username);
  await User.getByEmail();
  if (User.is_exists) {
    return callback(null, User)
  }
  return callback(null)
};

async function findUserUid (uid, callback) {

  var User = new userModel.User();
  User.row.uid = uid;
  await User.getByUid();
  if (User.is_exists) {
    return callback(null, User)
  }
  return callback(null)
};

passport.serializeUser(function (user, cb) {
  cb(null, user.row.uid)
});

passport.deserializeUser(function (uid, cb) {
  findUserUid(uid, cb);
  //cb(null, false);  -- only kill user
});

function initPassport () {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err)
        }
        // User not found
        if (!user) {
          return done(null, false, {message: 'Пользователь 1 с таким именем и паролем не найден'})
        }

        bcrypt.compare(password, user.row.spass, (err, isValid) => {
          if (err) {
            return done(err)
          }
          if (!isValid) {
            return done(null, false, {message: 'Пользователь 2 с таким именем и паролем не найден'})
          }
          return done(null, user)
        });
      })
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware
};

module.exports = initPassport
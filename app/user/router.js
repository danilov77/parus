const passport = require('passport')
const controller = require("./controller");

function initUser (app) {
  app.post('/user/new', userAdd);
  app.get('/', renderWelcome)
  app.get('/profile', passport.authenticationMiddleware(), renderProfile)
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))
}

function userAdd (req, response) {
  var res = controller.add();
  //response.send({success:true,redirect_url:'/'});
  response.send(res);
}

function renderWelcome (req, res) {
  res.send('renderWelcome');
  //res.render('user/welcome')
}

function renderProfile (req, res) {
  res.send('renderProfile');
  /*
  res.render('user/profile', {
    username: req.user.username
  })

   */
}

module.exports = initUser

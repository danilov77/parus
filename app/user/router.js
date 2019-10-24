const passport = require('passport')
const userController = require("./controller");
const coreConfig = require("../../config/core");
const opt = require("../../config/opt");

function initUser (app) {
  app.post('/user/new', userAdd);
  app.get('/user/profile', passport.authenticationMiddleware(), renderProfile)
//
  app.get('/user/clear', userClear);
}

/*************************************************************************** add
 1. ДОБАВЛЯЕМ нового пользователя
 2. ОТПРАВЛЯЕМ письмом пароль
*/

async function userAdd (req, response) {

  var res = coreConfig.resultXHR;

  try {
    res = await userController.add( req.body );
  } catch {
    res.result = -1;
    res.error.error_code = 'busy';
  };

  if (res.error) {
    if (res.error.error_code == 'busy') res.error.error_text = 'Сервер занят. Попробуйте повторить позднее';
    if (res.error.error_code == 'reglinkNotExists') res.error.error_text = 'Ваша ссылка устарела. Попробуйте повторить заново';
    if (res.error.error_code == 'userExists') res.error.error_text = 'Пользователь с таким адресом уже зарегистрирован в системе. <a href="/logon">Войти</a>';
  }

  if (res.result == 1) {

    // 2.
    if (opt.mailSend) {
      req.app.mailer.send( 'user/mail_usernew', {
          to: res.user.email,
          subject: 'PARUS - Регистрация',
          pass: res.user.pass_org
      }, function (err) {
          if (err) {
              console.error(err);
              res.result = -1;
              res.error_text = 'Сервер занят. Попробуйте повторить позднее ' + res.user.pass_org;
          } else {
              console.log('user/mail_usernew - HERE');
          }

          delete res.user;
          response.send(res);
      });
    } else {

//delete res.reglink.row;
response.send(res);
return;
    
    }

  } else {

    delete res.user;
    response.send(res);

  }
}

async function userClear (req, response) {

  var res = coreConfig.resultXHR;

  try {
    res = await userController.clear();
  } catch {
    res.result = -1;
    res.error.error_code = 'busy';
  };

  if (res.error) {

    if (res.error.error_code == 'busy') res.error.error_text = 'Сервер занят. Попробуйте повторить позднее';
    if (res.error.error_code == 'reglinkNotExists') res.error.error_text = 'Ваша ссылка устарела. Попробуйте повторить заново';
    if (res.error.error_code == 'userExists') res.error.error_text = 'Пользователь с таким адресом уже зарегистрирован в системе. <a href="/logon">Войти</a>';

  }

  response.send(res);
}

async function renderWelcome (req, res) {
  res.send('renderWelcome');
  //res.render('user/welcome')
}

async function renderProfile (req, res) {
  res.render('user/profile')
}

module.exports = initUser

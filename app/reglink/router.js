const reglinkController = require("./controller");
const coreConfig = require("../../config/core");
const opt = require("../../config/opt");

function init (app) {
  app.post('/reglink/send', reglinkSend);
  app.get('/reglink/clear', reglinkClear);
  app.get('/reglink/:uid', reglinkExists);
}

/*************************************************************************** exists
 1. ПРОВЕРЯЕМ валидность ссылки
*/

async function reglinkExists (req, response) {

  var uid = req.params.uid || '';

  var res = coreConfig.resultXHR;

  try {
    res = await reglinkController.get(uid);
  } catch {
    res.result = -1;
    res.error.error_code = 'busy';
  };

  if (res.error && res.error.error_code == 'busy') res.error.error_text = 'Сервер занят. Попробуйте повторить позднее';

  if (res.result == 1) {
    response.render('registration/registration', {
      reglink: res.reglink.note
    })
  } else {
    response.locals.message = 'Ссылка не найдена';
    response.locals.error = {
        stack: 'Ваша ссылка не найдена. Скорее всего она устарела. Попробуйте отправить ее заново'
    };
    response.status(500);
    response.render('views/errorpage');
  }
}

/*************************************************************************** send
 1. ДОБАВЛЯЕМ новую ссылку
 2. ОТПРАВЛЯЕМ письмом
*/

async function reglinkSend (req, response) {

  var email = req.body.email || '';

  var res = coreConfig.resultXHR;
console.log(opt.mailSend);
  // 1.
  try {
    res = await reglinkController.send(email);
  } catch {
    res.result = -1;
    res.error.error_code = 'busy';
  };

  if (res.error) {
    if (res.error.error_code == 'busy') res.error.error_text = 'Сервер занят. Попробуйте повторить позднее';
    if (res.error.error_code == 'checkEmail') res.error.error_text = 'Ошибка адреса почты. Проверьте правильность написания';
    if (res.error.error_code == 'userExists') res.error.error_text = 'Пользователь с таким e-mail уже зарегистрирован в системе. <br>Перейти на страницу <a href="/logon">входа<\a>?';
  }

  if (res.result == 1) {

    // 2.
    if (opt.mailSend) {
      req.app.mailer.send( 'reglink/mail_reg', {
          to: res.reglink.email,
          subject: 'PARUS - Регистрация',
          regcode: res.reglink.note
      }, function (err) {
          if (err) {
              console.error(err);
              res.result = -1;
              res.error_text = 'Сервер занят. Попробуйте повторить позднее';
          } else {
              console.log('reglinkController.set_send_at - HERE');
          }

          res.reglink.set_send_at();
          res.error_text = '<a href="/reglink/'+res.reglink.note + '">here</a>';
          delete res.reglink;
          response.send(res);
      });
    } else {

delete res.reglink.row;
response.send(res);
return;
    
    }

  } else {

    delete res.reglink;
    response.send(res);
  }
}

async function reglinkClear (req, response) {
  var res = await reglinkController.clear();
  response.send(res);
}

module.exports = init
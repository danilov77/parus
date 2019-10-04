const reglinkController = require("./controller");

function init (app) {

  app.post('/reglink/send', reglinkSend);

  app.get('/reglink/:uid', reglinkExists);
}

/*************************************************************************** exists
 1. ПРОВЕРЯЕМ валидность ссылки
*/

async function reglinkExists (req, response) {

  var uid = req.params.uid || '';

  var resp = {result:0};

  try {
    resp = await reglinkController.exists(uid);
  } catch {
    resp.result = -1;
    resp.error = 'busy';
  };

  if (resp.error == 'busy') resp.error_text = 'Сервер занят. Попробуйте повторить позднее';

  if (resp.result == 1) {
    response.render('registration/registration', {
      email: resp.reglink.email
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

  var resp = {result:0};

  // 1.
  try {
    resp = await reglinkController.send(email);
  } catch {
    resp.result = -1;
    resp.error = 'busy';
  };

  if (resp.error == 'busy') resp.error_text = 'Сервер занят. Попробуйте повторить позднее';
  if (resp.error == 'checkEmail') resp.error_text = 'Ошибка адреса почты. Проверьте правильность написания';
  if (resp.error == 'userExists') resp.error_text = 'Пользователь с таким e-mail уже зарегистрирован в системе. <br>Перейти на страницу <a href="/logon">входа<\a>?';

  if (resp.result == 1) {
      
    // 2.
    req.app.mailer.send( 'reglink/mail_reg', {
        to: resp.reglink.email,
        subject: 'PARUS - Регистрация',
        regcode: resp.reglink.note
    }, function (err) {
        if (err) {
            console.error(err);
            resp.result = -1;
            resp.error_text = 'Сервер занят. Попробуйте повторить позднее';
        } else {
            console.log('reglinkController.set_send_at - HERE');
        }

        resp.reglink.set_send_at();
        resp.error_text = '<a href="/reglink/'+resp.reglink.note + '">here</a>';
        delete resp.reglink;
        response.send(resp);
    });

  }

}

module.exports = init

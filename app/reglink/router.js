const reglinkController = require("./controller");

function init (app) {
  app.post('/reglink/send', reglinkSend);
}

async function reglinkSend (req, response) {

  var email = req.body.email || '';

  var resp = {result:0};

//  try {
    resp = await reglinkController.send(email);
//  } catch {
//    resp.result = -1;
//    resp.error = 'busy';
//  };

  if (resp.error == 'busy') resp.error_text = 'Сервер занят. Попробуйте повторить позднее';
  if (resp.error == 'checkEmail') resp.error_text = 'Ошибка адреса почты. Проверьте правильность написания';
  if (resp.error == 'userExists') resp.error_text = 'Пользователь с таким e-mail уже зарегистрирован в системе. <br>Перейти на страницу <a href="/logon">входа<\a>?';

  response.send(resp);

}

module.exports = init

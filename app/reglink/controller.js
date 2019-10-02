const reglinkModel = require("./model");
const coreLib = require("../lib/core.lib");
const userModel = require("../user/model");
const uuidv1 = require('uuid/v1');

var add = async function (obj){

    let expires_at = new Date();
    const hour = expires_at.getHours();
    expires_at.setHours(hour+3);

    obj.note = uuidv1();
    obj.add(expires_at);
		
};

/*************************************************************************** add
 1. ПРОВЕРЯЕМ есть ли отправка с таким e-mail
 2. ПРОВЕРЯЕМ есть ли пользователь с таким e-mail
 3. ДОБАВЛЯЕМ новую ссылку
 4. ОТПРАВЛЯЕМ ссылку на e-mail
 */

var send = async function (email){

  var resp = {result:0};
  var csrf = '';

  // 0.
  var check = await coreLib.checkEmail(email);
  if (!check) {
      resp.error = 'checkEmail';
      return resp;
  }

  // 1.
  var RegLink = new reglinkModel.RegLink(email);
  await RegLink.getByEmail();

  if (RegLink.is_exists) {

    csrf = RegLink.note;

  } else {

    // 2.
    var User = new userModel.User(email);
    User.getByEmail();

    if (User.is_exists) {
        resp.error = 'userExists';
        return resp;
    }

    // 3.
    add(RegLink);

    csrf = RegLink.note;

  }

  // 4.
  app.mailer.send( 'mail_reg', {
      to: RegLink.email,
      subject: 'PARUS - Регистрация',
      regcode: RegLink.note
  }, function (err) {
      if (err) {
          console.error(err);
      } else {
          RegLink.set_send();
      }
  });

  return resp;

};

module.exports.send = send;
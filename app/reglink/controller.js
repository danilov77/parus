const reglinkModel = require("./model");
const coreLib = require("../lib/core.lib");
const userModel = require("../user/model");
const uuidv1 = require('uuid/v1');

/*************************************************************************** add
 1. СЧИТАЕМ expires_at
 2. ГЕНЕРИРУЕМ случайную строку
 3. ДОБАВЛЯЕМ
*/
var add = async function (obj){

    // 1.
    let expires_at = new Date();
    const hour = expires_at.getHours();
    expires_at.setHours(hour+3);

    // 2.
    obj.note = uuidv1();
    // 3.
    obj.add(expires_at);
		
};

/*************************************************************************** send
 1. ПРОВЕРЯЕМ есть ли отправка с таким e-mail
 2. ПРОВЕРЯЕМ есть ли пользователь с таким e-mail
 3. ДОБАВЛЯЕМ
*/
var send = async function (email){

  var resp = {result:0};

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

    resp.result = 1;
    resp.reglink = RegLink;

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

    resp.result = 1;
    resp.reglink = RegLink;

  }

  return resp;

};

/*************************************************************************** exists
 1. ПОИСК ссылки
*/
var exists = async function (code){

  var resp = {result:0};

  // 1.
  var RegLink = new reglinkModel.RegLink('',code);

  await RegLink.getByCode();

  if (RegLink.is_exists) {

    resp.result = 1;
    resp.reglink = RegLink;

  }

  return resp;
};

module.exports.send = send;
module.exports.exists = exists;
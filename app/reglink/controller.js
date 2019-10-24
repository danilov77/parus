const reglinkModel = require("./model");
const coreLib = require("../lib/core.lib");
const userModel = require("../user/model");
const uuidv1 = require('uuid/v1');

/*************************************************************************** get
 1. ПОИСК ссылки
*/
var get = async function (code){

  var resp = {};

  // 1.
  var RegLink = new reglinkModel.RegLink('',code);

  await RegLink.getByCode();

  if (RegLink.is_exists) {

    resp.result = 1;
    resp.reglink = RegLink;

  }

  return resp;
};

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

  var resp = {};

  // 0.
  var check = await coreLib.checkEmail(email);
  if (!check) {
      resp.error.error_code = 'checkEmail';
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
    await User.getByEmail();

    if (User.is_exists) {
        resp.error.error_code = 'userExists';
        return resp;
    }

    // 3.
    add(RegLink);

    resp.result = 1;
    resp.reglink = RegLink;

  }

  return resp;

};

/*************************************************************************** del
 1. УДАЛЯЕМ
*/
var delById = async function (id){

  // 1.
  var RegLink = new reglinkModel.RegLink();
  RegLink.id = id;

  var resp = await RegLink.delById();

  resp.result = 1;
  return resp;

};

var clear = async function (){
  // 1.
  var RegLink = new reglinkModel.RegLink();
  var resp = await RegLink.del();

  resp.result = 1;
  return resp;

};

module.exports.get = get;
module.exports.send = send;
module.exports.delById = delById;
module.exports.clear = clear;
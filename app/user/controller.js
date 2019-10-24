const userModel = require("./model");
const reglinkController = require("../reglink/controller");
const passGen = require("../lib/pass.gen.js");
const bcrypt = require('bcrypt');

/*************************************************************************** get
 1. ПОИСК пользователя
*/

var get = async function (email){

  var resp = {};

  var User = new userModel.User(email);

  await User.getByEmail();

  if (User.is_exists) {

    resp.result = 1;
    resp.user = User;

  }

  return resp;
};

var passSet = async function (User){
  User.pass_org = await passGen();
  User.pass = bcrypt.hashSync(User.pass_org, 10);
  await User.passSet();
}

var pagestartSet = async function (User, page){
  await User.pagestartSet(page);
}

/*************************************************************************** add
 1. ПОИСК ссылки по коду
 2. ПОИСК пользователя с таким адресом
 3. ДОБАВЛЕНИЕ пользователя
 4. ДОБАВЛЕНИЕ карточки пользователя
 5. УДАЛЕНИЕ ссылки
 6. СОЗДАЕМ пароль
*/

var add = async function (body){

  resp = {};
  // 1.
  var reglink_get = await reglinkController.get(body.reglink);

  if (reglink_get.result!==1) {
    resp.error.error_code = 'reglinkNotExists';
    return resp;
  }

  // 2.
  var User = new userModel.User(reglink_get.reglink.email);
  await User.getByEmail();

  if (User.is_exists) {
    resp.error.error_code = 'userExists';
    return resp;
  }

  // 3.
  User.username = body.username;
  
  var res = await User.add();
  await User.getByEmail();

  if (User.is_exists==false) {
    resp.error.error_code = 'system';
    return resp;
  }

  // 4.
  User.card.livesplace = body.placename;
  User.card.livesplacelat = body.lat;
  User.card.livesplacelng = body.lng;
  User.card.birthday = body.datepicker;

  var res = await User.addCard();
  await User.getCard();

  // 5.
  reglinkController.delById(reglink_get.reglink.row.uid);

  // 6.
  await passSet(User);
  
  resp.result = 1;
  resp.user = User;
  
  return resp;

};

var clear = async function (){
  resp = {};
  resp = await userModel.clear();
  return resp;
}

module.exports.get = get;
module.exports.add = add;
module.exports.clear = clear;
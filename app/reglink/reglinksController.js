const reglinkModel = require("./reglinkModel");
const userModel = require("../users/userModel");
const passGen = require("../lib/pass.gen");

/*************************************************************************** add
 1. ПРОВЕРЯЕМ есть ли пользователь с таким e-mail
 2. УДАЛЯЕМ все отправленные ранее ссылки для такого e-mail
 3. ДОБАВЛЯЕМ новую ссылку
 4. ОТПРАВЛЯЕМ ссылку на e-mail
 */

var add = async function (app,email,csrf){

	let RegLink = new reglinkModel.RegLink(email,csrf);

// 1
	await RegLink.checkUser();

	if (RegLink.user_exists) {
		return { warning: true,
					message: "Пользователь с таким адресом уже зарегистрирован."};
	};

// 2
	await RegLink.del();

	await RegLink.set_expires_at(3);
// 3
	const result = await RegLink.add();

	if (result.success) {
// 4
		app.mailer.send( 'mail_reg', {
			to: RegLink.email,
			subject: 'PARUS - Регистрация',
			regcode: RegLink.note
		}, function (err) {
			if (err) {
				console.error(err);
			}
		});

		return { success: true,
			message: "Ссылка отправлена."};
	} else {
		console.error(result);
		return result;
	}

};

/*************************************************************************** check
 1. ПРОВЕРЯЕМ есть ли такая ссылка, ПОЛУЧАЕМ e-mail
 2. ГЕНЕРИРУЕМ пароль
 3. ДОБАВЛЯЕМ нового пользователя
 4. УДАЛЯЕМ все отправленные ранее ссылки для такого e-mail
 5. ОТПРАВЛЯЕМ учетные данные на e-mail
 6. РЕДИРЕКТ на вход
 */

var check = async function (app,reglink){

	let RegLink = new reglinkModel.RegLink('',reglink);
// 1
	await RegLink.get();

	if (RegLink.is_exists) {
// 2
		const pass = passGen();
// 3
		let User = new userModel.User(RegLink.email,pass);

		var result = await User.add();
// 4
		var result = await RegLink.del();
// 5
		app.mailer.send( 'mail_user_new', {
			to: User.email,
			subject: 'PARUS - Регистрация',
			login: User.email,
			pass: pass
		}, function (err) {
			if (err) {
				console.error(err);
			}
		});
// 6
		return { success: true,
			message: RegLink};
	};

	return { error: true,
		message: "Ваша ссылка устарела"};
};

module.exports.check = check;
module.exports.add = add;
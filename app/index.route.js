const passport = require('passport');
const codesRoute = require("./codes/codesRoute");
const reglinksController = require("./reglinks/reglinksController");

function mountRoutes(app) {

	app.post('/reg', function (req, res, next) {
		res.render('form_reg');
	});

	//TODO: protect
	app.get('/reg/:reglink', async function (req, res, next) {

		var result = await reglinksController.check( app, req.params["reglink"] );

		if (result.success) {
			res.render('message',
				{
					title: '2hearts.me - место удивительных встреч',
					alerttype: 'primary',
					//img: 'img height=200 src="/files/images/email.jpg" alt=""',
					message_head: 'Новый пользователь успешно добавлен',
					message_text: 'На Ваш адрес отправлен пароль. Войдите в систему с помощью него.'
				});
		} else {
			res.render('message',
				{
					title: '2hearts.me - место удивительных встреч',
					alerttype: 'warning',
					message_head: 'Ошибка регистрации нового пользователя',
					message_text: result.message
				});
		}
	});

	//TODO: protect
	app.post('/reg/code/send', async function(req, res){

		var result = await reglinksController.add( app, req.body.email, req.csrfToken());
res.send('test');
/*
		if (result.success) {
			res.render('message',
				{
					title: '2hearts.me - место удивительных встреч',
					alerttype: 'primary',
					img: 'img height=200 src="/files/images/email.jpg" alt=""',
					message_head: 'Проверьте Вашу почту',
					message_text: 'На Ваш адрес отправлена ссылка. Для продолжения регистрации перейдите по ней'
				});
		} else {
			res.render('message',
				{
					title: '2hearts.me - место удивительных встреч',
					alerttype: 'warning',
					message_head: 'Ошибка отправки письма',
					message_text: result.message
				});
		}
*/
	});

	//TODO: protect
	app.get('/logon', async function (req, res, next) {
		res.render('./authentication/logon', { title: '2hearts.me - место удивительных встреч' });
	});

	//TODO: protect
	app.post('/logon', async function (req, res, next) {
		/*
		var result = {error: true,
						message_text: "Ошибка пользователя"};

		 */
		var result = { success: true,
						redirect_url: "/" };
		res.send(result);
	});

	app.get('/profile', function(req, res){
		res.render('view_profile', { title: '2hearts.me - место удивительных встреч' });
	});

	//	app.use('/codes', codesRoute);

}

module.exports = mountRoutes
var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

var checkEmail = async function (email) {

    result = {success: true};

    if(!email.match(VALID_EMAIL_REGEX)) {
		result = {
			success: false,
			message_text: 'адрес некорректный'
		};
	};

    return result;
};

var randomIntGet = async function (min, max)	{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var randN = async function (min,max){

	var s ='';
	const abd ='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var aL = abd.length;
	const n = await randomIntGet(Number(min), Number(max))

	while(s.length < n)
		s += abd[Math.random() * aL|0];
	return s;	
}

module.exports.checkEmail = checkEmail;
module.exports.randN = randN;
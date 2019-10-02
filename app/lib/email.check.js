var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

function check(email) {

    result = {success: true};

    if(!email.match(VALID_EMAIL_REGEX)) {
		result = {
			success: false,
			message_text: 'адрес некорректный'
		};
	};

    return result;
}

module.exports = check

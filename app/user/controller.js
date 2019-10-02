const model = require("./model");

var get = async function (val){

	var User = new model.User(val);
	
	await User.init();

    return User;

};

var add = async function (req){

//	var User = new model.User(val);

//	const now = new Date()
//	var Code = new codeModel.Code(val);
	
//    return await Code.add(val,20,now);

  return {'success': false,
				'message_text': 'text'};

};

//module.exports.get = get;
module.exports.add = add;


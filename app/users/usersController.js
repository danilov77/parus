const userModel = require("./userModel");

var get = async function (val){

	var User = new userModel.User(val);
	
	await User.init();

    return User;

};
/*
var add = async function (val){

	const now = new Date()
	var Code = new codeModel.Code(val);
	
    return await Code.add(val,20,now);

};
*/
module.exports.get = get;
//module.exports.add = add;
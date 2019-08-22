const codeModel = require("./codeModel");

var get = async function (val){

	var Code = new codeModel.Code(val);
	
	await Code.init();

    return await Code.get();

};

var add = async function (val){

	const now = new Date()
	var Code = new codeModel.Code(val);
	
    return await Code.add(val,20,now);

};

module.exports.get = get;
module.exports.add = add;
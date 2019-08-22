const { Client } = require('pg')
const config = require("../config/db");

var query = function (sql,values,callback) {
	const client = new Client(config);
	client.connect();
	client.query(sql, values, callback);
}

var queryAsync = async function (sql,values) {

	const client = new Client(config)

	await client.connect()

	let res

	try {
		const rows = await client.query(sql, values)
		res = {'success': true,
				'rows': rows}
	} catch(err) {
		console.error(err.stack)
		res = {'success': false,
				'err': err}
	}

	await client.end()

	return res
}

module.exports.query = query
module.exports.queryAsync = queryAsync
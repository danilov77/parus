const DAL = require("../index.DAL");

var User = class {

    constructor(email,pass){
		this.email = email
		this.pass = pass
		this.is_exists = false
		this.row = {}
	}

   	async getByEmail() {

		const sql = 'SELECT * FROM v_users WHERE semail = $1';
		const values = [this.email]

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.is_exists = true
				this.row = data.rows.rows[0]
			}
		}
   }

   	async add() {
		const sql = 'INSERT INTO users (email,pass) VALUES ($1,$2)';
		const values = [this.email,this.pass]

		const result = await DAL.queryAsync(sql,values)

		return result;
	}

}

module.exports.User = User

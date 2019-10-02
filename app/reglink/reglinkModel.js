const DAL = require("../index.DAL");
const userModel = require("../users/userModel");


let RegLink = class {

    constructor(email,csrf){
		this.email = email
		this.note = csrf
		this.user_exists = false;
		this.row = {}
	}

	async get() {
		const sql = 'SELECT * FROM v_reglinks WHERE snote = $1';
		const values = [this.note]

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.email = data.rows.rows[0].semail;
				this.is_exists = true
				this.row = data.rows.rows[0]
			}
		}
	}

	async add() {
		const sql = 'INSERT INTO reglinks (email,expires_at,note) VALUES ($1,$2,$3)';
		const values = [this.email, this.expires_at, this.note]

		const result = await DAL.queryAsync(sql,values)

		return result;
	}

	async del() {
		const sql = 'DELETE FROM v_reglinks WHERE semail = $1';
		const values = [this.email]

		const result = await DAL.queryAsync(sql,values)

		return result;
	}

	async checkUser() {
		var User = new userModel.User(this.email);
		await User.getByEmail();
		this.user_exists = User.is_exists;
	}

	async set_expires_at(hour_live) {

		var d = new Date();

		const hour = d.getHours();
		d.setHours(hour+hour_live);

		this.expires_at = d;

	}

}

module.exports.RegLink = RegLink

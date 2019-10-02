const DAL = require("../index.DAL");

var RegLink = class {

    constructor(email,csrf){

        this.email = email;
		this.note = csrf;
		this.is_exists = false;
		this.row = {};

    }

	async getByCode() {

        const sql = 'SELECT * FROM v_reglinks WHERE snote = $1';
		const values = [this.note];

		const data = await DAL.queryAsync(sql,values);

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.email = data.rows.rows[0].semail;
				this.is_exists = true;
				this.row = data.rows.rows[0];
			}
		}
	}

	async getByEmail() {

        const sql = 'SELECT * FROM v_reglinks WHERE semail = $1';
		const values = [this.email];

		const data = await DAL.queryAsync(sql,values);

		if (data.success) {
			if (data.rows.rowCount != 0) {
                this.note = data.rows.rows[0].snote;
				this.is_exists = true;
				this.row = data.rows.rows[0];
			}
		}
	}

	async add(expires_at) {

        const sql = 'INSERT INTO reglinks (email,expires_at,note) VALUES ($1,$2,$3)';
        const values = [this.email,expires_at,this.note]

        const result = await DAL.queryAsync(sql,values)

        return result;
    
	}

	async del() {

        const sql = 'SELECT * FROM v_reglinks WHERE snote = $1';
		const values = [this.note];

		const data = await DAL.queryAsync(sql,values);

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.email = data.rows.rows[0].semail;
				this.is_exists = true;
				this.row = data.rows.rows[0];
			}
		}
	}

	async set_send() {

        const sql = 'UPDATE reglinks SET send_at = NOW() WHERE id = $1';
		const values = [this.row.uid];

        const result = await DAL.queryAsync(sql,values)

        return result;
	}

}

module.exports.RegLink = RegLink
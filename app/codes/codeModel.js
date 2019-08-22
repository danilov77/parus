const DAL = require("../index.DAL");

var Code = class {

    constructor(code){
		this.code = code
		this.is_exists = false
		this.row = {}
	}

   	async init() {

		const sql = 'SELECT * FROM v_codes WHERE scode = $1';
		const values = [this.code]

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.is_exists = true
				this.row = data.rows.rows[0]
			}
		}
   }

   	async add( code, percent, expires_at ) {
		const sql = 'INSERT INTO codes (code,percent,expires_at) VALUES ($1,$2,$3)';
		const values = [code, percent, expires_at]

		const result = await DAL.queryAsync(sql,values)

		return result;
	}

   	async get() {
		return { 'is_exists': this.is_exists,
					'row': this.row }
	}

}

module.exports.Code = Code

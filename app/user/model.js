const DAL = require("../index.DAL");

var User = class {

  constructor(email,pass){
		this.email = email
		this.pass = pass
		this.pass_org = ''
		this.is_exists = false
		this.row = {}
		this.card = {}
	}

  async getCard() {

    const sql = 'SELECT * FROM v_user_cards WHERE uuser_id = $1';
		const values = [this.row.uid];

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.card = data.rows.rows[0];
			}
		}
  }

  async getByEmail() {

		const sql = 'SELECT * FROM v_users WHERE semail = $1';
		const values = [this.email]

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.is_exists = true;
        this.pass = '';
				this.row = data.rows.rows[0];
			}
		}
   }

  async getByUid() {

		const sql = 'SELECT * FROM v_users WHERE uid = $1';
		const values = [this.row.uid];

		const data = await DAL.queryAsync(sql,values)

		if (data.success) {
			if (data.rows.rowCount != 0) {
				this.is_exists = true;
        this.pass = '';
				this.row = data.rows.rows[0];
			}
		}
   }

  async add() {
		const sql = 'INSERT INTO users (name,email) VALUES ($1,$2)';
		const values = [this.username,this.email];

		const result = await DAL.queryAsync(sql,values);

		return result;
	}

  async addCard() {
		const sql = 'INSERT INTO user_cards (user_id,birthday,livesplace,livesplacelat,livesplacelng,sex) VALUES ($1,$2,$3,$4,$5,$6)';
		const values = [this.row.uid,this.card.birthday,this.card.livesplace,this.card.livesplacelat,this.card.livesplacelng,this.card.sex];

		const result = await DAL.queryAsync(sql,values);

		return result;
	}

  async passSet() {
		const sql = 'UPDATE users SET pass = $1 WHERE id = $2';
		const values = [this.pass,this.row.uid];

		const result = await DAL.queryAsync(sql,values);

		return result;
	}

  async pagestartSet(page) {
		const sql = 'UPDATE users SET page_start = $1 WHERE id = $2';
		const values = [page,this.row.uid];

		const result = await DAL.queryAsync(sql,values);

		return result;
	}
}

var clearCards = async function (){

		const sql = 'DELETE FROM user_cards';
		const result = await DAL.queryAsync(sql);

		return result;
}

var clear = async function (){

    await clearCards();
		const sql = 'DELETE FROM users';
		const result = await DAL.queryAsync(sql);

		return result;
}

module.exports.User = User
module.exports.clear = clear

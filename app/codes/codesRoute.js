const codesController = require("./codesController");

const express = require('express');
const router = express.Router();

router.get('/:code', async function(req, res) {
	var code = await codesController.get(req.params["code"]);
	res.send(code);
});

router.post('/:code', async function(req, res) {
	var code = await codesController.add(req.params["code"]);
	res.send(code);
});

module.exports = router;

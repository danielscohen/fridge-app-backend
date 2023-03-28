const express = require('express');
const router = express.Router();
const { getAccounts } = require('../controllers/accounts');



router.route('/getAll').get(getAccounts);

module.exports = router;

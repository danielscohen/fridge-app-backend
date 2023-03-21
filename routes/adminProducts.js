const express = require('express');
const router = express.Router();
const { deleteProduct, getProduct, getAllProductsAllUsers } = require('../controllers/adminProducts');



router.route('/').get(getAllProductsAllUsers);
router.route('/:id').get(getProduct).delete(deleteProduct);

module.exports = router;
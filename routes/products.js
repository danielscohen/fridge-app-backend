const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } = require('../controllers/products');



router.route('/').post(createProduct).get(getAllProducts);
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct);

module.exports = router;
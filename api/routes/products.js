const express = require('express');
const router = express.Router();
const AuthMiddlware = require('../middleware/auth');
const ProductController = require('../controllers/product');

router.get('/', ProductController.products_get_all);

router.post('/', AuthMiddlware, ProductController.upload.single('productImage'), ProductController.product_create);

router.get('/:productId', ProductController.product_show);

router.patch('/:productId', AuthMiddlware, ProductController.product_update);

router.delete('/:productId', AuthMiddlware, ProductController.product_destroy);

module.exports = router;
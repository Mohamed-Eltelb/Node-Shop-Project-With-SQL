const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/add-product', productsController.getAddProduct);
router.get('/products', productsController.getAdminProducts);
router.post('/add-product', productsController.postAddProduct);
router.post('/products', productsController.postDeleteProduct);
router.get('/edit-product/:productId', productsController.getEditProduct);
router.post('/edit-product/:productId', productsController.postEditProduct);

module.exports = router;
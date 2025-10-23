const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getIndex);
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProduct);
router.get('/cart', productsController.getCart);
router.post('/add-to-cart', productsController.postAddToCart);
router.post('/update-quantity', productsController.updateQuantityInCart);
router.post('/remove-from-cart', productsController.postRemoveFromCart);
router.get('/checkout', productsController.getCheckout);

module.exports = router;
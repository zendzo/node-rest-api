const express =  require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const AuthMiddleware = require('../middleware/auth');
const OrderController = require('../controllers/orders');

// const Order = require('../models/order');


router.get('/', AuthMiddleware, OrderController.orders_get_all);

router.post('/', AuthMiddleware, OrderController.order_create);

router.get('/:orderId', AuthMiddleware, OrderController.order_show);

router.patch('/:orderId', AuthMiddleware, OrderController.order_update)

router.delete('/:orderId', AuthMiddleware, OrderController.order_destory);

module.exports = router;
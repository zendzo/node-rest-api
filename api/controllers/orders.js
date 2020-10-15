const mongoose = require('mongoose');
const Order = require('../models/order');

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(docs => {
      res.status(200)
        .json({
          count: docs.length,
          orders: docs.map(order => {
            return {
              product: order.product,
              quantity: order.quantity,
              _id: order._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + order._id
              }
            }
          })
        })
    })
    .catch(error => {
      res.status(500)
        .json({
          error: error
        });
    });
};

exports.order_create = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.body.productId)) {
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    const result = order.save();
    console.log(result);
    res.status(200)
      .json({
        message: "Order Created Succesully",
        createdOrder: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
  } else {
    console.log('Invalid Product Id');
    res.status(404)
      .json({
        message: "Product Not Found"
      })
  }
};

exports.order_show = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(result => {
      console.log(result);
      res.status(200)
        .json({
          product: result.product,
          quantity: result.quantity,
          _id: result._id,
          request: {
            type: "GET",
            url: "https://localhost:3000/orders"
          }
        });
    })
    .catch(error => {
      console.log(error);
      res.status(404)
        .json({
          message: "Order not Found"
        });
    });
};

exports.order_update = (req, res, next) => {
  res.status(200).json({
    message: 'edit a product',
    orderId: req.params.orderId
  })
};

exports.order_destory = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.orderId)) {
    Order.remove({ _id: mongoose.Types.ObjectId(req.params.orderId) })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200)
          .json({
            message: "Order Deleted",
            request: {
              type: "GET",
              url: "http://localhost:300/orders"
            },
            // result: result
          });
      }).catch(error => {
        res.status(500)
          .json({
            error: error
          })
      })
  } else {
    console.log('Order Not Found');
    res.status(500)
      .json({
        message: "Order not found"
      });
  }
};
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const AuthMiddlware = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString()+'-'+file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }else{
    cb(new Error('file not accept'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 2
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find().select('name price _id productImage')
  .exec()
  .then(result => {
    const response = {
      count: result.length,
      products: result.map(doc => {
        return {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          image: "http://localhost:3000/"+doc.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/"+doc._id
          }
        }
      })
    };
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/', AuthMiddlware, upload.single('productImage'), (req, res, next) => {
  console.log(req.file.path);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: "Product Succesfully Created",
      createdProduct: {
        _id: result._id,
        name: result.name,
        price: result.price,
        image: "http://localhost/3000/"+result.productImage,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/"+result._id
        }
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      error: error
    });
  });
});

router.get('/:productId',(req,res,next) => {
  const id = req.params.productId;
  Product.findById(id).exec()
  .then(doc => {
    console.log(doc);
    res.status(200).json({
      _id: doc._id,
      name: doc.name,
      price: doc.price,
      image: "http://localhost:3000/"+doc.productImage,
      request: {
        type: "GET",
        url: "http://localhost:3000/products/"
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({error: error});
  });
});

router.patch('/:productId', AuthMiddlware, (req, res, next) => {
  const id = req.params.productId
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  // res.json(updateOps);
 Product.updateOne({_id: id},{$set: updateOps}).exec()
 .then(result => {
   console.log(result);
   res.status(200).json({
     message: "Product Updated Succesully",
     request: {
       type: "GET",
       url: "http://localhost:3000/products/"+ id
     }
   });
 })
 .catch(error => {
    console.log(error);
    res.status(500).json({
      error: error
    })
 });
});

router.delete('/:productId', AuthMiddlware, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id}).exec()
  .then(result => {
    res.status(200).json({
      message: "Product Deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/products",
        body: {
          name: "String",
          price: "Number"
        }
      }
    })
  }).catch(error => {
    res.status(500).json({
      error: error
    });
  });
});

module.exports = router;
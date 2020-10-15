const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req,res,next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user.length != 0) {
      return res.status(422)
      .json({
        message: "User already exist"
      });
    }else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(500)
            .json({
              error: err
            });
        } else {
          const user = new User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user.save()
            .then(result => {
              console.log(result);
              res.status(200)
                .json({
                  message: "User was created"
                });
            })
            .catch(error => {
              res.status(500)
                .json({
                  error: error
                });
            });
        }
      });
    }
  })
});

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email}).exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401)
      .json({
        message: "Auth Failed"
      });
    }
    bcrypt.compare(req.body.password,user[0].password,(err,result) => {
       if (err) {
         return res.status(401)
           .json({
             message: "Auth Failed"
           });
       }
       if (result) {
         const token = jwt.sign({
           email: user[0].email,
           _id: user[0]._id
         },
         process.env.JWT_KEY,
         {
           expiresIn: "1h"
         });
         return res.status(200)
          .json({
            message: "Auth Succesful",
            toke: token
          });
       }
      //  why should we return again? UNLESS no response
      return res.status(401)
        .json({
          message: "Auth Failed"
        });
    });
  })
  .catch(error => {
    res.status(500)
    .json({
      error: error
    });
  })
})

module.exports = router;
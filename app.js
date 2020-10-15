const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// mongoose.connect('mongodb+srv://mustofa:'+ process.env.MONGO_ATLAS_PW +'@cluster0.nszln.mongodb.net/'+ process.env.MONGO_ATLAS_DB +'?retryWrites=true&w=majority', 
//   { useNewUrlParser: true,useUnifiedTopology: true}
// );

mongoose.connect('mongodb://localhost/rest_api_shop', { useNewUrlParser: true, useUnifiedTopology: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('we are connected!');
// });

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// handle cors to allow all origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE'
      );
      return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  const error =  new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error,req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message 
    }
  });
})

module.exports = app;
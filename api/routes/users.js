const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');


router.post('/signup', UserController.users_signup);

router.post('/login', UserController.users_login);

module.exports = router;
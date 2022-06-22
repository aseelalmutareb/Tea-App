const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const config = require('config');
const JWT_SECRET = config.get('jwt_secret.access');
const { check, validationResult } = require('express-validator');

// import users data
const users = require('../datasets/userData');

// login
router.get('/users', (req, res) => {
    res.status(200).json(users);
});


module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

// import users data
const users = require('../datasets/userData');

// import user controller
const { register, login } = require('../controllers/userControllers');

/**
 * @route GET /users
 * @desc Get all users
 * @access Private
 */
// add a middleware to lock this route
router.get('/users', auth, (req, res) => {
    res.status(200).json(users);
});

/**
 * @route POST /register
 * @desc Register a user
 * @access Public
 */
router.post('/register', 
    check('name', 'Name is required').notEmpty(), // middleware check for name
    check('email', 'Enter a valid email').isEmail(), // middleware check for email
    check('password', 'Password needs to be at least 6 characters long').isLength({min: 6}), // middleware check for password
    register // controller function
);

/**
 * @route POST /login
 * @desc Let a user log in
 * @access Public
 */
router.post('/login', login);


module.exports = router;
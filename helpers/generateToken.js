const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET = config.get('jwt_secret.access');

/**
 * 
 * @param {*} user -- the payload of the jwt signiture
 * @returns {string} -- the token
 */
const generateToken = (user) => jwt.sign(user, JWT_SECRET, { expiresIn: '60s' });

module.exports = generateToken;
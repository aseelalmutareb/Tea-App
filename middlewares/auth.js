const jwt = require('jsonwebtoken');
const config = require('config');
const JWT_SECRET = config.get('jwt_secret.access');

const authenticateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if(!token) return res.status(401).json({ message: "Forbidden"});

jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({ message: "Unauthorized!" });
    req.user = user;
    next();
});
};

module.exports = authenticateToken;
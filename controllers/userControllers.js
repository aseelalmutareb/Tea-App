const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// import users data
const users = require("../datasets/userData");

const register = async (req, res) => {
  // validation, sanitization, authorization

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  // find a user with same email, if found send error: email is taken

  const Id = users.length;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    id: Id,
    name: name,
    email: email,
    password: hashedPassword,
  };

  users.push(user);

  // authorization with jwt
  // prepare a payload
  const payload = {
    user: {
      id: user.id,
      name: user.name,
    },
  };
  // sign and generate the token
  jwt.sign(
        payload, 
        config.get("jwt_secret.access"),
        { expiresIn: '60s' },
        (err, token) => {
            if(err) return res.status(403).json('Access Denied');
            res.json({
                token: token,
                users: users
            });
        });
};

const login = async (req, res) => {};

module.exports = { register, login };
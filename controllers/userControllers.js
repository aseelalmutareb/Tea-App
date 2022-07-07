const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// import users data
const users = require("../datasets/userData");
const generateToken = require("../helpers/generateToken");

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
      id: user.id,
      name: user.name,
  };
  // sign and generate the token
  try {
    const token = await generateToken(payload);
    res.json({ token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};

const login = async (req, res) => {
    const { email, password } = req.body;
    // find user
    const user = users.find(user => user.email == email);
    if(!user) return res.status(404).json({ message: 'Either email or password is incorrect!'});
    
    try {
        if(!password) return res.status(400).json({ message: 'A password was not provided'});
        // compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(404).json({ message: 'Either email or password is incorrect!' });

        // generate access token
        const payload = {
              id: user.id,
              name: user.name
            };
            
        // sign and generate the token
            const token = await generateToken(payload);
            res.json({ token: token, message: "You're logged in." });
          
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong..' });
    }
};

module.exports = { register, login };

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
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
  const isRegistered = await User.findOne({ email });
  if(isRegistered) return res.status(409).json(`${email} is already registered`);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create(
    {
      name,
      email,
      password: hashedPassword
    }
  );

  // authorization with jwt
  // prepare a payload
  const payload = {
      id: user._id,
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
    const user = await User.findOne({email});

    if(!user) return res.status(404).json({ message: 'Either email or password is incorrect!'});
    
    try {
        if(!password) return res.status(400).json({ message: 'A password was not provided'});
        // compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(404).json({ message: 'Either email or password is incorrect!' });

        // generate access token
        const payload = {
              id: user._id,
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

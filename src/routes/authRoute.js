const authRoute = require('express').Router();
const User = require('../modals/user');
const { validateSignUpData, hashPassword, validateLoginData } = require('../utils/validator');

authRoute.post('/signup', async (req, res) => {
  try {
    // validate request body
    validateSignUpData(req.body);
    //password should be hashed before saving to database
    const encryptedPassword = await hashPassword(req.body.password);
    const { firstName, lastName, email } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });
    await user.save();
    res.json({ message: 'User signed up successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    return res.status(400).json({ message: error.message });
  }
});

//login API
authRoute.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req.body, res);
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check password
    const isMatch = await user.validatePassword(password);
    //const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await user.getJWT();
      console.log('Generated JWT token:', token);
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hour
        httpOnly: true,
      });
      res.json({ message: 'Login successful' });
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: error.message });
  }
});

//Logout API
authRoute.post('/logout', (req, res) => {
  //res.clearCookie('token');
  res.cookie('token', null, { expires: new Date(0), httpOnly: true });
  res.json({ message: 'Logout successful' });
});

module.exports = authRoute;

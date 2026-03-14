const express = require('express');
const bcrypt = require('bcrypt');
const { auth, userAuth } = require('./middlewares/auth');
const { connectDB } = require('./config/database');
const User = require('./modals/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { validateSignUpData, hashPassword, validateLoginData } = require('./utils/validator');

const app = express();
app.use(express.json());
app.use(cookieParser());
// signup API
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req.body);
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await jwt.sign({ _id: user._id }, 'DEV@Tinder$46', { expiresIn: '1h' });
      console.log('Generated JWT token:', token);
      res.cookie('token', token);
      res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//update user by email
app.patch('/updateuser', (req, res) => {
  try {
    const email = req.body.email;
    const updateData = req.body.updateData;
    User.findOneAndUpdate({ email }, updateData, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.send({ user: updatedUser });
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  } catch (error) {
    console.error('Error validating update data:', error);
    return res.status(400).json({ message: error.message });
  }
});

//get one user by email
app.get('/getProfile', userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(400).json({ message: error.message });
  }
});

//get all users
app.get('/feed', (req, res) => {
  User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.send({ users });
    })
    .catch((error) => {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

connectDB()
  .then(() => {
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

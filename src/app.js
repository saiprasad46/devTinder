const express = require('express');
const bcrypt = require('bcrypt');
const { auth, userAuth } = require('./middlewares/auth');
const { connectDB } = require('./config/database');
const User = require('./modals/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { validateSignUpData, hashPassword, validateLoginData } = require('./utils/validator');
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const connectionRoute = require('./routes/connectionRoute');
const userRoute = require('./routes/userRoute');
const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/', authRoute);
app.use('/', profileRoute);
app.use('/', connectionRoute);
app.use('/', userRoute);

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

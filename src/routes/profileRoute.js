const profileRoute = require('express').Router();
const User = require('../modals/user');
const { hashPassword, validatePassword } = require('../utils/validator');
const { userAuth } = require('../middlewares/auth');

//update user by email
profileRoute.patch('/profile/update', (req, res) => {
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
profileRoute.get('/profile/view', userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(400).json({ message: error.message });
  }
});

profileRoute.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const message = await validatePassword(userId, oldPassword, newPassword);
    if (message) {
      throw new Error(message);
    }
    const encryptedPassword = await hashPassword(newPassword);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: encryptedPassword }
    );
    if (updatedUser) {
      res.json({ message: 'Password updated succesfully' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
module.exports = profileRoute;

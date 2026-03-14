const User = require('../modals/user');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decodedMessage = await jwt.verify(token, 'DEV@Tinder$46');
    if (decodedMessage && decodedMessage._id) {
      const user = await User.findOne({ _id: decodedMessage._id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user; // Attach user to request object
      next();
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.error('Error in userAuth middleware:', error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { userAuth };

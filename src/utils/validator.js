const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../modals/user');
const ConnectionRequest = require('../modals/connectionRequest');

const saltRounds = 10;

const validateSignUpData = (data) => {
  const { firstName, lastName, email, password } = data;
  // const includedFields = ["firstName", "lastName", "email", "password","age", "mobileNumber", "skills"];

  if (firstName.length > 50) {
    throw new Error('First name must be less than 50 characters');
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    throw new Error('Invalid last name');
  }
  if (lastName.length > 50) {
    throw new Error('Last name must be less than 50 characters');
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new Error('Invalid password');
  }
};

const validateLoginData = (data, res) => {
  const { email, password } = data;
  // Validate email and password
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  if (!email || !validator.isEmail(email)) {
    console.log('THIS CONDOTO');
    throw new Error('Invalid email');
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new Error('Invalid password');
  }
};

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const validatePassword = async (userId, oldPassword, newPassword) => {
  let msg = '';
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const oldP = oldPassword?.trim(' ');
  const newP = newPassword?.trim(' ');
  const user = await User.findOne({ _id: userId });
  const isMatch = await user.validatePassword(oldP);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (!isMatch) {
    msg = 'Invalid OldPassword';
  }
  if (oldP == newP) {
    msg = 'Old password cannot be same as New password';
  }
  if (newP?.length < 8 || newP?.length > 15) {
    msg = 'Password length cannot be less than 8 and greater than 15';
  }
  if (!passwordRegex.test(newP)) {
    msg = 'Password is not valid';
  }
  return msg;
};

const validateConnectionReqPayload = (req, res) => {
  const fromUserId = req?.user?._id;
  const status = req?.params?.status;
  const toUserId = req?.params?.userId;
  const allowedStatuses = ['ignored', 'interested'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid Staus Type');
  }
  if (fromUserId.toString() === toUserId) {
    throw new Error('From User and To User are same');
  }
};

const validateConnectionReqfromDB = async (req) => {
  const toUserId = req?.params?.userId;
  const fromUserId = req?.user?._id;
  const existingConnectionRequestData = await ConnectionRequest.findOne({
    $or: [
      {
        fromUserId,
        toUserId,
      },
      {
        fromUserId: toUserId,
        toUserId: fromUserId,
      },
    ],
  });
  if (existingConnectionRequestData) {
    throw new Error('Connection Request already Exist');
  }

  const isToUserExist = await User.findOne({ _id: toUserId });
  if (!isToUserExist) {
    throw new Error('To User does not exist');
  }
};
module.exports = {
  validateSignUpData,
  validateLoginData,
  hashPassword,
  validatePassword,
  validateConnectionReqPayload,
  validateConnectionReqfromDB,
};

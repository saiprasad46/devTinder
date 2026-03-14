const bcrypt = require('bcrypt');
const validator = require('validator');
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

const validateLoginData = (data) => {
  const { email, password } = data;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (!email || !validator.isEmail(email)) {
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
module.exports = { validateSignUpData, validateLoginData, hashPassword };

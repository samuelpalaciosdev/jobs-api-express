const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ name: user.name, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  //! If user doesn't exist
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials, please provide email and password again');
  }
  // * If user exists
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ name: user.name, token });
};

module.exports = { register, login };

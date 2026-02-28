const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { sendResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return sendResponse(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.USER_REGISTERED, {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = generateToken(user._id);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return sendResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return sendResponse(res, HTTP_STATUS.OK, 'User profile retrieved successfully', userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};

const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_MISSING,
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID,
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_INVALID,
    });
  }
};

module.exports = authMiddleware;

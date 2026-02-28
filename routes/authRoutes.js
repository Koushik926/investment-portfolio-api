const express = require('express');
const {
  register,
  login,
  getProfile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;

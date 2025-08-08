// routes/authRoutes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/authController'); // Add getMe
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload')

const router = express.Router();

// The middleware runs before the register function.
// 'profilePicture' must match the field name used in the form data.
router.post('/register', upload.single('profilePicture'), register);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
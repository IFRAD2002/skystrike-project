
const Pilot = require('../models/Pilot');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new pilot
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password, callsign, role } = req.body;
    try {
        const pilotData = { name, email, password, callsign, role };

        // If a file was uploaded, add its path to our data object
        if (req.file) {
            // We store the path that the browser can use to access the image
            pilotData.profilePicture = req.file.path; // req.file.path is now a full URL from Cloudinary
        }
        
        const pilot = await Pilot.create(pilotData);
        const token = generateToken(pilot._id); // Assuming generateToken is in this file
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login a pilot
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        // Check for user and select the password field which is normally hidden
        const pilot = await Pilot.findOne({ email }).select('+password');

        if (!pilot || !(await pilot.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(pilot._id);
        res.status(200).json({ success: true, token, message: "Enlist yourself into a journey of thrill commrade" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// controllers/authController.js
// ... (keep the existing register, login, and generateToken functions)

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    // Because our "protect" middleware ran first,
    // it already found the user and attached it to the request object.
    const user = req.user;
    res.status(200).json({ success: true, data: user });
};
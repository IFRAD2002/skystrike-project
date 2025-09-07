
const Pilot = require('../models/Pilot');
const jwt = require('jsonwebtoken');

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

        
        if (req.file) {
            
            pilotData.profilePicture = req.file.path; 
        }
        
        const pilot = await Pilot.create(pilotData);
        const token = generateToken(pilot._id); 
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Login a pilot
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        
        const pilot = await Pilot.findOne({ email }).select('+password');

        if (!pilot || !(await pilot.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(pilot._id);
        res.status(200).json({ success: true, token, message: "Welcome commrade" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {

    const user = req.user;
    res.status(200).json({ success: true, data: user });
};
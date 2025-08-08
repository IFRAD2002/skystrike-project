// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Pilot = require('../models/Pilot');

exports.protect = async (req, res, next) => {
  let token;

  // Check if the token is in the headers and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // If header exists, try to get the token from it
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    // Using 'return' ensures the function stops here
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token and attach it to the request object
    // Exclude the password from being attached to the request
    req.user = await Pilot.findById(decoded.id).select('-password');

    // If no user is found with this id, it's an invalid token
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Proceed to the next step (the controller function)
    next();
  } catch (error) {
    // This will catch any errors from jwt.verify, like an expired or malformed token
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
          success: false, 
          error: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};
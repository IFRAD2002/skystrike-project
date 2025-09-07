
const jwt = require('jsonwebtoken');
const Pilot = require('../models/Pilot');

exports.protect = async (req, res, next) => {
  let token;

  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    
    token = req.headers.authorization.split(' ')[1];
  }

  
  if (!token) {
    
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = await Pilot.findById(decoded.id).select('-password');

    
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
  
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};



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
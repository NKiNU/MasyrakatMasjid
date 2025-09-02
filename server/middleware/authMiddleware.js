// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header, expect format "Bearer <token>"
  console.log("autheticating user")
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: process.env.NODE_ENV === 'development'
        ? 'No token provided in Authorization header.'
        : 'Access denied.',
    });
  }
  
  console.log("there is a token")
  console.log(process.env.JWT_SECRET)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token has expired.' });
    } else {
      return res.status(403).json({ message: 'Invalid token.' });
    }
  }
  


};

// Middleware to authorize role-based access
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    console.log("authorizing user as" + req.user.role)
    // Ensure that req.user exists and has a role
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have the required role.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };

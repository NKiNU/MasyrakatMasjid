// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { register, login,getUserInfo,updateProfile,  sendVerificationEmail, 
  resendVerification, 
  verifyEmail, forgotPassword, getAllUsers,getAdminUsers,deleteUser,updateUser,changePassword,
  getSpecificUserInfo,createUser } = require('../controllers/authController'); // Correct import of controller functions
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware'); // Correct import of middleware

const authRoutes = express.Router();

// Public Routes
authRoutes.post('/signup', register); // Allow user, admin, and super admin registration
authRoutes.post('/login', login); // Login route

authRoutes.get('/me', authenticateToken, getUserInfo);
// authRoutes.get('/:id',authenticateToken,getUserInfo);
authRoutes.put('/me', authenticateToken, updateProfile);

// Protected Routes (Example)
authRoutes.get('/admin', authenticateToken, authorizeRole('admin', 'super admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin or Super Admin!' });
});

authRoutes.get('/super-admin', authenticateToken, authorizeRole('super admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Super Admin!' });
});

authRoutes.get('/user', authenticateToken, authorizeRole('user', 'admin', 'super admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome User!' });
});

// Get Current User
authRoutes.get('/currentUser', async (req, res) => {
  // console.log("get current user", req)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
});



// Email verification
// authRoutes.post('/send-verification', sendVerificationEmail);
authRoutes.post('/resend-verification', resendVerification);
authRoutes.get('/verify-email/:token', verifyEmail);
authRoutes.post('/forgot-password', forgotPassword); 

authRoutes.get('/users', authenticateToken, authorizeRole('super admin'), getAllUsers);
authRoutes.get('/admin-users', authenticateToken, getAdminUsers);
authRoutes.delete('/users/:id', authenticateToken, deleteUser);
authRoutes.put('/users/:id', authenticateToken,  updateUser);
authRoutes.post("/change-password/:id", authenticateToken, changePassword);
authRoutes.get('/:id', authenticateToken, getUserInfo);
authRoutes.get('/user/:id', authenticateToken,  getSpecificUserInfo);
authRoutes.post('/user/create', authenticateToken,  createUser);



authRoutes.get('/google-calendar-auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events']
  });
  res.redirect(authUrl);
});

authRoutes.get('/google-calendar-callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in user's document
    await User.findByIdAndUpdate(req.user._id, {
      googleCalendarToken: tokens
    });

    res.redirect('/calendar'); // Redirect to your calendar page
  } catch (error) {
    console.error('Google Calendar auth error:', error);
    res.status(500).json({ message: 'Error authenticating with Google Calendar' });
  }
});


module.exports = authRoutes;

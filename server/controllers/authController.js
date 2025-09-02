const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { generateVerificationToken } = require('../utils/tokens');
const { sendEmail, sendTemporaryPassword } = require('../utils/emails');



// Register a new user
// In your register function
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    console.log('Verification token generated:', verificationToken);
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      isVerified: false,
    });
    
    await user.save();
    
    // Create the verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    // Send verification email with the complete link
    await sendEmail(email, 'verificationEmail', verificationLink);
    
    res.status(201).json({ success: true, message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Backend: Add controller function (authController.js)
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      role,
      emailNotifications,
      address,
      isVerified
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      role,
      emailNotifications,
      address,
      isVerified,
      createdAt: new Date()
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Send verification email
// exports.sendVerificationEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({ success: false, message: 'Email already verified' });
//     }

//     await sendEmail(email, user.verificationToken);

//     res.json({ success: true, message: 'Verification email sent successfully' });
//   } catch (error) {
//     console.error('Send verification error:', error);
//     res.status(500).json({ success: false, message: 'Failed to send verification email' });
//   }
// };

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const newVerificationToken = generateVerificationToken();
    user.verificationToken = newVerificationToken;
    await user.save();

    await sendEmail(email, newVerificationToken);

    res.json({ success: true, message: 'Verification email resent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend verification email' });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    // Extract the token from the request parameters
    const { token } = req.params;

    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid verification token' 
      });
    }

    // If the user's email is already verified, return a 400 error
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already verified' 
      });
    }

    // Mark the user's email as verified and remove the token
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save(); // Save the updated user object

    // Respond with a success message
    res.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify email' 
    });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user.isVerified){
      
      return res.status(401).json({ message: 'Not Verified' });

    }
    if ( !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, role: user.role, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log('User:', user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSpecificUserInfo = async (req, res) => {
  try {
    // Super admin can access all user information
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get contacts
exports.getContacts = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('username profileImage');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

// Get all users (for super admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verificationToken -verificationCode');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin users only
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin'] } })
      .select('-password -verificationToken -verificationCode');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (super admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user+req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update user (for admin/super admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id; // Assuming `req.user` contains the authenticated user ID

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided currentPassword with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    // const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// Function to generate a random temporary password
const generateTemporaryPassword = () => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let tempPassword = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    tempPassword += charset[randomIndex];
  }
  
  return tempPassword;
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    
    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    
    // Update user's password and set flag to require password change
    user.password = hashedPassword;
    user.passwordChangeRequired = true;
    user.passwordTemporaryExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
    await user.save();

    // Send email with temporary password
    await sendEmail(email,'temporaryPassword', temporaryPassword);
    
    res.status(200).json({ 
      message: 'Temporary password has been sent to your email',
      expiresIn: '24 hours'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: error.message || 'Error processing forgot password request' 
    });
  }
};


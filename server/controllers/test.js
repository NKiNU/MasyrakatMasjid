// // src/controllers/auth.controller.js
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import User from '../models/user.model.js';
// import { sendEmail } from '../utils/email.js';
// import { generateVerificationToken } from '../utils/tokens.js';

// export const signup = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate verification token
//     const verificationToken = generateVerificationToken();

//     // Create new user
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//       verificationToken,
//       isVerified: false
//     });

//     await user.save();

//     // Send verification email
//     await sendVerificationEmail(email, verificationToken);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully. Please verify your email.'
//     });

//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error during signup. Please try again later.'
//     });
//   }
// };

// export const sendVerificationEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already verified'
//       });
//     }

//     await sendEmail(email, user.verificationToken);

//     res.json({
//       success: true,
//       message: 'Verification email sent successfully'
//     });

//   } catch (error) {
//     console.error('Send verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to send verification email'
//     });
//   }
// };

// export const resendVerification = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already verified'
//       });
//     }

//     // Generate new verification token
//     const newVerificationToken = generateVerificationToken();
//     user.verificationToken = newVerificationToken;
//     await user.save();

//     await sendEmail(email, newVerificationToken);

//     res.json({
//       success: true,
//       message: 'Verification email resent successfully'
//     });

//   } catch (error) {
//     console.error('Resend verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to resend verification email'
//     });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid verification token'
//       });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already verified'
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Email verified successfully'
//     });

//   } catch (error) {
//     console.error('Email verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to verify email'
//     });
//   }
// };
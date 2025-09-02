const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  gender: String,
  dateOfBirth: {
    date: String,
    month: String,
    year: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  verificationToken: String,
  verificationCode: String,
  verificationCodeExpiry: Date,
  passwordChangeRequired: {
    type: Boolean,
    default: false,
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
  },
  profileImage: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'super admin'],
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
  googleAccessToken: String,
  googleRefreshToken: String,
  tokenExpiry: Date,
  calendarConnected: { type: Boolean, default: false },
});


module.exports = mongoose.model('User', UserSchema);

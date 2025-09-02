// Frontend - src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: {
      date: '',
      month: '',
      year: ''
    },
    profileImage: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post('/api/profile/upload-image', formData);
      setUser({ ...user, profileImage: response.data.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const initiatePasswordChange = async () => {
    try {
      await axios.post('/api/auth/initiate-password-change', { email: user.email });
      setShowVerification(true);
    } catch (error) {
      console.error('Error initiating password change:', error);
    }
  };

  const verifyAndChangePassword = async () => {
    try {
      await axios.post('/api/auth/change-password', {
        email: user.email,
        code: verificationCode,
        newPassword
      });
      setShowVerification(false);
      setNewPassword('');
      setVerificationCode('');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="flex p-6 max-w-4xl mx-auto">
      <div className="w-1/4 mr-8">
        <div className="mb-4">
          <img
            src={user.profileImage || '/default-avatar.png'}
            alt="Profile"
            className="w-full rounded-full"
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="mt-2"
          />
          <p className="text-sm text-gray-500">Max size: 1MB</p>
          <p className="text-sm text-gray-500">Formats: JPEG, PNG</p>
        </div>
      </div>

      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-600 mb-6">Manage and protect your account</p>

        <form className="space-y-4">
          <div className="flex items-center">
            <label className="w-32">Username</label>
            <span>{user.username}</span>
          </div>

          <div className="flex items-center">
            <label className="w-32">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32">Email</label>
            <span>{user.email}</span>
            <button type="button" className="ml-2 text-blue-500">Change</button>
          </div>

          <div className="flex items-center">
            <label className="w-32">Phone</label>
            <span>{user.phone}</span>
            <button type="button" className="ml-2 text-blue-500">Change</button>
          </div>

          <div className="flex items-center">
            <label className="w-32">Gender</label>
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={user.gender === 'Male'}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                /> Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={user.gender === 'Female'}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                /> Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={user.gender === 'Other'}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                /> Other
              </label>
            </div>
          </div>

          <div>
            <label className="w-32 block mb-2">Change Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="border rounded px-2 py-1 mb-2"
            />
            <button
              type="button"
              onClick={initiatePasswordChange}
              className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
            >
              Change Password
            </button>
          </div>

          {showVerification && (
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={verifyAndChangePassword}
                className="ml-2 bg-green-500 text-white px-4 py-1 rounded"
              >
                Verify & Change
              </button>
            </div>
          )}

          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

// Backend - models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  gender: String,
  dateOfBirth: {
    date: String,
    month: String,
    year: String
  },
  profileImage: String,
  password: { type: String, required: true },
  verificationCode: String,
  verificationCodeExpiry: Date
});

module.exports = mongoose.model('User', userSchema);

// Backend - controllers/profileController.js
const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initiatePasswordChange = async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const user = await User.findOne({ email: req.body.email });
    
    user.verificationCode = code;
    user.verificationCodeExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      // Configure your email service
    });

    await transporter.sendMail({
      from: 'your-email@domain.com',
      to: user.email,
      subject: 'Password Change Verification',
      text: `Your verification code is: ${code}`
    });

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      verificationCode: req.body.code,
      verificationCodeExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
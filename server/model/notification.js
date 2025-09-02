
const { string } = require('joi');
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'booking', 'class', 'donation', 'general', 'purchase', 'service', 'flag', 'unflag','class-enrollment','class-enrollment-admin','class-capacity'],
    required: true
  },
  referenceId: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy:{
    type:String,
    default:"system"
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
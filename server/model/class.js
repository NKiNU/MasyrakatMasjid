// backend/models/Class.js
const mongoose = require('mongoose');

// Common fields for flagging that can be added to any content schema
const flaggableFields = {
  isHidden: {
    type: Boolean,
    default: false
  },
  flagMessage: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flaggedAt: Date
};

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    enum: ['physical', 'online'],
    required: true
  },
  venueDetails: {  // Add this new field
    type: String,
    required: true,
    trim: true
  },  startDate: {          // Add this field
    type: Date,
    required: true
  },
  startTime: {          // Add this field
    type: String,
    required: true,
    trim: true
  },
    capacity: {     // Add this field
    type: Number,
    required: true,
    min: 1
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String  // Firebase URLs
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  ...flaggableFields
});

module.exports = mongoose.model('Class', classSchema);
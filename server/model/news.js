// newsModel.js
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

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  ...flaggableFields
});

module.exports = mongoose.model('News', newsSchema);
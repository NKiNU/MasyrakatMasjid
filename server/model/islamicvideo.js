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

const islamicVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['lecture', 'quran', 'nasheed', 'documentary', 'tutorial']
  },
  speaker: {
    type: String,
    required: true,
    trim: true
  },

  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  ...flaggableFields
}, {
  timestamps: true
});

module.exports = mongoose.model('IslamicVideo', islamicVideoSchema);
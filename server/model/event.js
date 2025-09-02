// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    
  },
  endDate: {
    type: Date,
    
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  googleEventId: {
    type: String,
    sparse: true
  },
  source: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  lastSyncedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
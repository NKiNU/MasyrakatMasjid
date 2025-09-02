// models/availability.model.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  // Now dates are stored as an array of date and time slots for that date
  dates: [{
    date: {
      type: Date,
      required: true
    },
    timeSlots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }]
});

// Compound index to ensure unique dates per service
availabilitySchema.index({ serviceId: 1, 'dates.date': 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);

// models/booking.model.js
const bookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  adminNotes: String,
  calendarEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Booking,Availability };
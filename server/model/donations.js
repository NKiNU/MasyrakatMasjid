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

const donationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    donations: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
    ...flaggableFields
});


module.exports = mongoose.model('Donation', donationSchema);

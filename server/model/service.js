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

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flagDetails: {
      message: {
        type: String,
        trim: true,
      },
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      flaggedAt: {
        type: Date,
        default: null,
      },
    },
  //   timeSlots: {
  //     type:[
  //     {
  //       startTime: {
  //         type: String,
  //         required: true,
  //       },
  //       endTime: {
  //         type: String,
  //         required: true,
  //       },
  //     },
      
  //   ],default:[]
  // },
    duration: {
      type: Number,
      required: true,
      min: 0, // Duration in minutes
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ...flaggableFields
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);

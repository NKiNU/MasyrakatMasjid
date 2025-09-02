const mongoose = require("mongoose");

const classScheme = new mongoose.Schema({
  type: {
    type: String,
    enum: ['flag', 'system', 'user'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedService: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  }
}, {
  timestamps: true
});


const ClassInboxModel = mongoose.model("inbox", classScheme);
module.exports = ClassInboxModel;

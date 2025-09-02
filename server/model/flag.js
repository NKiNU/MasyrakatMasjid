const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  contentId: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  },
  unflagMessage: {
    type: String
  }
});

const flagModel = mongoose.model("Flag", flagSchema);
module.exports = flagModel;

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    default: Date.now
  },
  actdate: {
    type: Date,
    required: function() {
      return this.category === 'class';
    }
  },
  classType: {
    type: String,
    enum: ['online', 'physical'] // Add enum for class type: online or physical
  },
  onlineLink: {
    type: String,
    required: function() {
      return this.classType === 'online'; // Make it required only if the class type is 'online'
    }
  },
  classFee: {
    type: String,
    enum: ['free', 'paid']
  },
  classFeeAmount: {
    type: Number,
    required: function() {
      return this.classFee === 'paid';
    }
  },
  media: {
    type: [String],
    require: true
  }
});

const ContentModel = mongoose.model("Content", contentSchema);
module.exports = ContentModel;

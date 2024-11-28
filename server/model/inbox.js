const mongoose = require("mongoose");

const classScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  userName: {
    type: String
  },
  opened:{
    type:Boolean
  },
  createdDatetime:{
    type: Date, // Field for content creation date and time
    default: Date.now
  }

});


const ClassInboxModel = mongoose.model("inbox", classScheme);
module.exports = ClassInboxModel;

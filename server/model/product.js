const mongoose = require('mongoose');

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

const ProductSchema = new mongoose.Schema(
  {
    img: [],
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ...flaggableFields
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);

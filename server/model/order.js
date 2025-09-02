// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentType: {
    type: String,
    enum: ['donation', 'service', 'purchase','class'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'processing', 'completed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  serviceFee: Number,
  deliveryFee: Number,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  serviceDetails: {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String,
    date: Date,
    timeSlot: Object,
    notes: String
  },
  donationDetails: {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    title: String,
    description: String
  },
  classDetails: {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    title: String,
    description: String,
    startDate: Date,
    startTime: String,
    venue: String
  },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String }
  },
  paymentInfo: {
    transactionId: String,
    paymentMethod: String,
    paidAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
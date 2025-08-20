// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pilot',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  // Optional: Link to a specific mission to make notifications clickable
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);

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
  
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
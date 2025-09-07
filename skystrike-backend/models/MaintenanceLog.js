// models/MaintenanceLog.js
const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please add a maintenance description'],
    },
    serviceDate: {
      type: Date,
      default: Date.now,
    },
    aircraft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aircraft',
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
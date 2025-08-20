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
    // You could add a reference to the GroundCrew who performed the work
    // performedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Pilot', // Assuming GroundCrew are also in the Pilot/User model
    //   required: true,
    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
// models/Aircraft.js
const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema(
  {
    tailNumber: {
      type: String,
      required: [true, 'Please add a tail number'],
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add an aircraft model'],
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'IN_MAINTENANCE', 'OUT_OF_SERVICE'],
      default: 'ACTIVE',
    },
    image: {
      type: String,
      default: 'uploads/no-jet-photo.jpg',
    },
    // --- NEW FIELDS START HERE ---
    scheduledMaintenanceDate: {
      type: Date,
      required: false,
    },
    scheduledMaintenanceNotes: {
      type: String,
      required: false,
      trim: true,
    },
    // --- NEW FIELDS END HERE ---
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Aircraft', aircraftSchema);
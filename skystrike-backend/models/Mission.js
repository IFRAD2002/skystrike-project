
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  pilot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pilot',
    required: true,
  },
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aircraft',
    required: true,
  },
  
  flightHoursLogged: {
    type: Number,
  },
  flightDate: {
    type: Date,
  },
  
}); 

const missionSchema = new mongoose.Schema(
  {
    objective: {
      type: String,
      required: [true, 'Please add a mission objective'],
    },
    missionDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABORTED'],
      default: 'PLANNED',
    },
    
    assignments: [assignmentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mission', missionSchema);
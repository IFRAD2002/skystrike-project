
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pilotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // This will not show the password in query results
    },
    callsign: {
      type: String,
      required: [true, 'Please add a callsign'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['Pilot', 'Air Battle Manager'],
      default: 'Pilot',
    },
    profilePicture: {
      type: String, 
      default: 'no-photo.jpg',
    },
    flightHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving the document
pilotSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare entered password to hashed password in database
pilotSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Pilot', pilotSchema);
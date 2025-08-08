// controllers/pilotController.js
const Pilot = require('../models/Pilot');

// @desc    Get all pilots
// @route   GET /api/pilots
exports.getPilots = async (req, res) => {
  try {
    const pilots = await Pilot.find();
    res.status(200).json({ success: true, count: pilots.length, data: pilots });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a pilot
// @route   POST /api/pilots
exports.createPilot = async (req, res) => {
  try {
    const pilot = await Pilot.create(req.body);
    res.status(201).json({ success: true, data: pilot });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get a single pilot
// @route   GET /api/pilots/:id
exports.getPilotById = async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) {
      return res.status(404).json({ success: false, error: 'Pilot not found' });
    }
    res.status(200).json({ success: true, data: pilot });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
// controllers/maintenanceController.js
const MaintenanceLog = require('../models/MaintenanceLog');
const Aircraft = require('../models/Aircraft');

// @desc    Get all maintenance logs for a specific aircraft
// @route   GET /api/aircrafts/:aircraftId/maintenance
exports.getLogsForAircraft = async (req, res) => {
  try {
    const logs = await MaintenanceLog.find({ aircraft: req.params.aircraftId });
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new maintenance log for an aircraft
// @route   POST /api/aircrafts/:aircraftId/maintenance
exports.createMaintenanceLog = async (req, res) => {
  try {
    req.body.aircraft = req.params.aircraftId; // Add aircraftId from URL to the body

    const aircraft = await Aircraft.findById(req.params.aircraftId);
    if (!aircraft) {
        return res.status(404).json({ success: false, error: 'Aircraft not found' });
    }

    const log = await MaintenanceLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
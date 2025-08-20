// routes/maintenanceRoutes.js
const express = require('express');
const {
  getLogsForAircraft,
  createMaintenanceLog,
} = require('../controllers/maintenanceController');

const { protect, authorize } = require('../middleware/authMiddleware');

// The { mergeParams: true } option allows us to access params from parent routers (like :aircraftId)
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getLogsForAircraft)
  .post(protect, authorize('Air Battle Manager', 'Pilot'), createMaintenanceLog);

module.exports = router;
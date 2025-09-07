
const express = require('express');
const {
  getLogsForAircraft,
  createMaintenanceLog,
} = require('../controllers/maintenanceController');

const { protect, authorize } = require('../middleware/authMiddleware');


const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getLogsForAircraft)
  .post(protect, authorize('Air Battle Manager', 'Pilot'), createMaintenanceLog);

module.exports = router;
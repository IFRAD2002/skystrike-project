// routes/missionRoutes.js
const express = require('express');
const {
  getMissions,
  createMission,
  updateMissionStatus,
  addAssignmentToMission,
  logFlightHours,
} = require('../controllers/missionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getMissions)
    .post(protect, authorize('Air Battle Manager'), createMission);

router.route('/:id/status')
    .put(protect, authorize('Air Battle Manager'), updateMissionStatus);

router.route('/:id/assign')
    .put(protect, authorize('Air Battle Manager'), addAssignmentToMission);

// --- THIS IS THE CORRECTED, FINAL ROUTE ---
router.route('/:missionId/assignments/:assignmentId/log').put(protect, logFlightHours);

module.exports = router;
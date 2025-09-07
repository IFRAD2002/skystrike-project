
const express = require('express');
const { getSortieReport, getDashboardStats  } = require('../controllers/reportsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/sorties').get(protect, authorize('Air Battle Manager'), getSortieReport);
router.route('/stats').get(protect, authorize('Air Battle Manager'), getDashboardStats);

module.exports = router;
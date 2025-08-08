// routes/aircraftRoutes.js
const express = require('express');
const {
  getAircrafts,
  createAircraft,
  getAircraftById,
  updateAircraft,
  deleteAircraft,
} = require('../controllers/aircraftController');

// Import our middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // 1. Import upload middleware

const router = express.Router();

// Public routes
router.route('/').get(getAircrafts);

// Protected routes
router
  .route('/')
  .post(
    protect,
    authorize('Air Battle Manager'),
    upload.single('image'), // 2. Add the middleware here
    createAircraft
  );

router
  .route('/:id')
  .get(getAircraftById)
  .put(protect, authorize('Air Battle Manager', 'Pilot'), updateAircraft)
  .delete(protect, authorize('Air Battle Manager'), deleteAircraft);

module.exports = router;
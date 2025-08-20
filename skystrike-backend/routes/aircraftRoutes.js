
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
const upload = require('../middleware/upload');

// Import the new maintenance router
const maintenanceRouter = require('./maintenanceRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:aircraftId/maintenance', maintenanceRouter);

// Public routes
router.route('/').get(getAircrafts);

// Protected routes
router
  .route('/')
  .post(
    protect,
    authorize('Air Battle Manager'),
    upload.single('image'), 
    createAircraft
  );

router
  .route('/:id')
  .get(getAircraftById)
  .put(protect, authorize('Air Battle Manager', 'Pilot'), updateAircraft)
  .delete(protect, authorize('Air Battle Manager'), deleteAircraft);

module.exports = router;

const express = require('express');
const {
  getAircrafts,
  createAircraft,
  getAircraftById,
  updateAircraft,
  deleteAircraft,
} = require('../controllers/aircraftController');


const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');


const maintenanceRouter = require('./maintenanceRoutes');

const router = express.Router();


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
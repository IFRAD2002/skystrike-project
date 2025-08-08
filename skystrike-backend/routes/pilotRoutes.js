
const express = require('express');
const {
  getPilots,
  createPilot,
  getPilotById,
} = require('../controllers/pilotController');

const router = express.Router();

router.route('/').get(getPilots).post(createPilot);

router.route('/:id').get(getPilotById);

module.exports = router;
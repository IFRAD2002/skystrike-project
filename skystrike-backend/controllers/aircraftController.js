// controllers/aircraftController.js
const Aircraft = require('../models/Aircraft');

// --- HELPER FUNCTION ---
// This function checks a single aircraft and updates its status if needed.
const checkAndUpdateMaintenanceStatus = async (aircraft) => {
  if (aircraft.scheduledMaintenanceDate && aircraft.status === 'ACTIVE') {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    const scheduledDate = new Date(aircraft.scheduledMaintenanceDate);
    scheduledDate.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // If the scheduled date is today or in the past, update the status
    if (scheduledDate <= today) {
      aircraft.status = 'IN_MAINTENANCE';
      await aircraft.save();
      console.log(`Aircraft ${aircraft.tailNumber} status automatically updated to IN_MAINTENANCE.`);
    }
  }
};


// @desc    Get all aircraft
// @route   GET /api/aircrafts
exports.getAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find();

    // Loop through and check each aircraft before sending the response
    for (const craft of aircrafts) {
      await checkAndUpdateMaintenanceStatus(craft);
    }

    res.status(200).json({ success: true, count: aircrafts.length, data: aircrafts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create an aircraft
// @route   POST /api/aircrafts
exports.createAircraft = async (req, res) => {
  try {
    const { tailNumber, model, status } = req.body;
    const aircraftData = { tailNumber, model, status };

    if (req.file) {
      aircraftData.image = `uploads/${req.file.filename}`; // Or req.file.path for Cloudinary
    }

    const aircraft = await Aircraft.create(aircraftData);
    res.status(201).json({ success: true, data: aircraft });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get a single aircraft
// @route   GET /api/aircrafts/:id
exports.getAircraftById = async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ success: false, error: 'Aircraft not found' });
    }

    // Check the aircraft's status before sending the response
    await checkAndUpdateMaintenanceStatus(aircraft);

    res.status(200).json({ success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update an aircraft
// @route   PUT /api/aircrafts/:id
exports.updateAircraft = async (req, res) => {
    try {
        const aircraft = await Aircraft.findById(req.params.id);

        if (!aircraft) {
            return res.status(404).json({ success: false, error: 'Aircraft not found' });
        }
        
        // If status is changing from IN_MAINTENANCE to ACTIVE, clear the schedule
        if (
            aircraft.status === 'IN_MAINTENANCE' && 
            req.body.status === 'ACTIVE' &&
            aircraft.scheduledMaintenanceDate
        ) {
            req.body.scheduledMaintenanceDate = null;
            req.body.scheduledMaintenanceNotes = '';
            console.log(`Maintenance for ${aircraft.tailNumber} completed. Clearing schedule.`);
        }

        const updatedAircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: updatedAircraft });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete an aircraft
// @route   DELETE /api/aircrafts/:id
exports.deleteAircraft = async (req, res) => {
    try {
        const aircraft = await Aircraft.findById(req.params.id);

        if (!aircraft) {
            return res.status(404).json({ success: false, error: 'Aircraft not found' });
        }

        if (aircraft.status !== 'OUT_OF_SERVICE') {
            return res.status(400).json({ 
                success: false, 
                error: `Aircraft cannot be deleted unless status is OUT_OF_SERVICE` 
            });
        }

        await aircraft.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
    
};
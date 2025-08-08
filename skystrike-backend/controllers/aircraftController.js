
const Aircraft = require('../models/Aircraft');

// @desc    Get all aircraft
// @route   GET /api/aircrafts
exports.getAircrafts = async (req, res) => {
  try {
    const aircrafts = await Aircraft.find();
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

    // Check if a file was uploaded
    if (req.file) {
      // Save the path to the image
      aircraftData.image = `uploads/${req.file.filename}`;
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
    res.status(200).json({ success: true, data: aircraft });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateAircraft = async (req, res) => {
    try {
        let aircraft = await Aircraft.findById(req.params.id);

        if (!aircraft) {
            return res.status(404).json({ success: false, error: 'Aircraft not found' });
        }

        aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: aircraft });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteAircraft = async (req, res) => {
    try {
        const aircraft = await Aircraft.findById(req.params.id);

        if (!aircraft) {
            return res.status(404).json({ success: false, error: 'Aircraft not found' });
        }

        // Check the condition before deleting
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
}


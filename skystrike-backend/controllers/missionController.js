
const Mission = require('../models/Mission');
const Aircraft = require('../models/Aircraft');
const Pilot = require('../models/Pilot');
const Notification = require('../models/Notification');

exports.getMissions = async (req, res) => {
  try {
    
    const missions = await Mission.find().populate({
      path: 'assignments',
      populate: [
        { path: 'pilot', select: 'callsign name' },
        { path: 'aircraft', select: 'tailNumber model' }
      ]
    });
    res.status(200).json({ success: true, count: missions.length, data: missions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a mission (now only needs an objective)
// @route   POST /api/missions
exports.createMission = async (req, res) => {
  try {
    const mission = await Mission.create({ objective: req.body.objective });
    res.status(201).json({ success: true, data: mission });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// @desc    Add a pilot/aircraft assignment to a mission
// @route   PUT /api/missions/:id/assign
exports.addAssignmentToMission = async (req, res) => {
    try {
        const { pilotId, aircraftId } = req.body;
        const mission = await Mission.findById(req.params.id);

        if (!mission) {
            return res.status(404).json({ success: false, error: 'Mission not found' });
        }
        
        const newAssignment = { pilot: pilotId, aircraft: aircraftId };
        mission.assignments.push(newAssignment);

        await mission.save();

        const message = `New Assignment: You have been assigned to mission "${mission.objective}"`;
        
        // 2. Save the notification to the database
        await Notification.create({
            recipient: pilotId,
            message: message,
            mission: mission._id,
        });

        // 3. Send the real-time alert
        const io = req.app.get('socketio');
        io.emit("getNotification", {
            recipientId: pilotId,
            message: message,
        });
        
        console.log(`Notification saved and sent for pilot ${pilotId}`);
        // --- END OF LOGIC ---

        res.status(200).json({ success: true, data: mission });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a mission's status
// @route   PUT /api/missions/:id/status
exports.updateMissionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const mission = await Mission.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!mission) {
            return res.status(404).json({ success: false, error: 'Mission not found' });
        }
        res.status(200).json({ success: true, data: mission });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};



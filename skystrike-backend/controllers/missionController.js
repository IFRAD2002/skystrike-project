// controllers/missionController.js
const Mission = require('../models/Mission');
const Pilot = require('../models/Pilot');
const Notification = require('../models/Notification');

// --- All other functions (getMissions, createMission, etc.) remain the same ---
exports.getMissions = async (req, res) => { /* ... */ };
exports.createMission = async (req, res) => { /* ... */ };
exports.addAssignmentToMission = async (req, res) => { /* ... */ };
exports.updateMissionStatus = async (req, res) => { /* ... */ };


// @desc    Log flight hours for the logged-in pilot's assignment in a mission
// @route   PUT /api/missions/:id/log
exports.logFlightHours = async (req, res) => {
    try {
        const { flightHours, flightDate } = req.body;
        const mission = await Mission.findById(req.params.id); // Get mission by its ID

        if (!mission) {
            return res.status(404).json({ success: false, error: 'Mission not found' });
        }

        // Find the specific assignment within the mission that belongs to the logged-in user
        const assignment = mission.assignments.find(
            (a) => a.pilot.toString() === req.user.id
        );

        if (!assignment) {
            return res.status(404).json({ success: false, error: 'Assignment for this pilot not found in this mission' });
        }
        
        // Update the assignment with the logged hours and date
        assignment.flightHoursLogged = flightHours;
        assignment.flightDate = flightDate;
        
        // Update the pilot's total flight hours
        const pilot = await Pilot.findById(req.user.id);
        pilot.flightHours += Number(flightHours);
        
        await pilot.save();
        await mission.save();

        res.status(200).json({ success: true, data: mission });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
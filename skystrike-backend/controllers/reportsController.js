// controllers/reportsController.js
const Mission = require('../models/Mission');
const Aircraft = require('../models/Aircraft');

// @desc    Generate a sortie report
// @route   GET /api/reports/sorties
exports.getSortieReport = async (req, res) => {
  try {
    // Aggregation pipeline to count sorties per pilot
    const pilotStats = await Mission.aggregate([
      { $match: { status: 'COMPLETED' } }, // 1. Filter for completed missions
      { $unwind: '$assignments' }, // 2. Create a separate document for each assignment
      { $group: { _id: '$assignments.pilot', count: { $sum: 1 } } }, // 3. Group by pilot and count
      { $sort: { count: -1 } }, // 4. Sort by the most sorties
      { $lookup: { from: 'pilots', localField: '_id', foreignField: '_id', as: 'pilotDetails' } }, // 5. Join with pilots collection
      { $unwind: '$pilotDetails' },
      { $project: { _id: 0, pilotId: '$_id', callsign: '$pilotDetails.callsign', sorties: '$count' } } // 6. Format the output
    ]);

    // Aggregation pipeline to count sorties per aircraft
    const aircraftStats = await Mission.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $unwind: '$assignments' },
      { $group: { _id: '$assignments.aircraft', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $lookup: { from: 'aircrafts', localField: '_id', foreignField: '_id', as: 'aircraftDetails' } },
      { $unwind: '$aircraftDetails' },
      { $project: { _id: 0, aircraftId: '$_id', tailNumber: '$aircraftDetails.tailNumber', model: '$aircraftDetails.model', sorties: '$count' } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        pilotStats,
        aircraftStats
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get dashboard analytics (status breakdown, etc.)
// @route   GET /api/reports/stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Aggregate aircraft statuses
        const statusStats = await Aircraft.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } }
        ]);

        // Aggregate completed missions by month
        const monthlySorties = await Mission.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $unwind: '$assignments' },
            { 
                $group: { 
                    _id: { month: { $month: '$missionDateTime' }, year: { $year: '$missionDateTime' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { 
                $project: { 
                    name: { 
                        $let: {
                           vars: { monthsInYear: [ '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ] },
                           in: { $concat: [ { $arrayElemAt: [ '$$monthsInYear', '$_id.month' ] }, '-', { $toString: '$_id.year' } ] }
                        }
                    },
                    sorties: '$count', 
                    _id: 0 
                } 
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                statusStats,
                monthlySorties,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
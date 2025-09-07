
const express = require('express');
const { getNotifications, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.use(protect);

router.route('/').get(getNotifications);
router.route('/markread').put(markAllAsRead);

module.exports = router;
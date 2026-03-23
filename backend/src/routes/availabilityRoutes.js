const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAvailability,
  getAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');

router.get('/availability', authMiddleware, getAvailability);
router.post('/availability', authMiddleware, createAvailability);
router.delete('/availability/:availabilityId', authMiddleware, deleteAvailability);

module.exports = router;
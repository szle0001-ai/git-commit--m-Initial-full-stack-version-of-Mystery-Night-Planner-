const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createEvent,
  getEvents,
  deleteEvent
} = require('../controllers/eventController');

router.get('/', authMiddleware, getEvents);
router.post('/', authMiddleware, createEvent);
router.delete('/:eventId', authMiddleware, deleteEvent);

module.exports = router;
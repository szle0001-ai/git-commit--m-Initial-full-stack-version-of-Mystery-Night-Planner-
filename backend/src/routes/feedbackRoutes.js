const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createFeedback,
  getFeedbackByEvent,
  deleteFeedback
} = require('../controllers/feedbackController');

router.get('/events/:eventId/feedback', authMiddleware, getFeedbackByEvent);
router.post('/events/:eventId/feedback', authMiddleware, createFeedback);
router.delete('/feedback/:feedbackId', authMiddleware, deleteFeedback);

module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createTask,
  getTasksByEvent,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.get('/events/:eventId/tasks', authMiddleware, getTasksByEvent);
router.post('/events/:eventId/tasks', authMiddleware, createTask);
router.put('/tasks/:taskId', authMiddleware, updateTask);
router.delete('/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;
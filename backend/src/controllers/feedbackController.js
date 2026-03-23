const pool = require('../db/db');

const createFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { game_title, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!game_title || !rating) {
      return res.status(400).json({ error: 'Game title and rating are required.' });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const result = await pool.query(
      `INSERT INTO feedback (event_id, user_id, game_title, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [eventId, userId, game_title, numericRating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE FEEDBACK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const getFeedbackByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await pool.query(
      `SELECT f.*, u.name AS user_name
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.event_id = $1
       ORDER BY f.created_at DESC`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('GET FEEDBACK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM feedback
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [feedbackId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found or not owned by user.' });
    }

    res.json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    console.error('DELETE FEEDBACK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByEvent,
  deleteFeedback
};
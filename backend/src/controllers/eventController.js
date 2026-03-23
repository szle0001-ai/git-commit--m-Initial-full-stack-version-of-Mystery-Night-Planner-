const pool = require('../db/db');

const createEvent = async (req, res) => {
  try {
    const { title, description, location, event_date } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event date are required.' });
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, location, event_date, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description || null, location || null, event_date, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating event.' });
  }
};

const getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name AS creator_name
       FROM events e
       LEFT JOIN users u ON e.created_by = u.id
       ORDER BY e.event_date ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM events
       WHERE id = $1 AND created_by = $2
       RETURNING *`,
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or not owned by user.' });
    }

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('DELETE EVENT ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent
};
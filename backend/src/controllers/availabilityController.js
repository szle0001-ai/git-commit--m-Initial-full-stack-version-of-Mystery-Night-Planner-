const pool = require('../db/db');

const createAvailability = async (req, res) => {
  try {
    const { available_date, status } = req.body;
    const userId = req.user.userId;

    if (!available_date || !status) {
      return res.status(400).json({ error: 'Date and status are required.' });
    }

    if (!['available', 'unavailable'].includes(status)) {
      return res.status(400).json({ error: 'Status must be available or unavailable.' });
    }

    const existing = await pool.query(
      `SELECT * FROM availability
       WHERE user_id = $1 AND available_date = $2`,
      [userId, available_date]
    );

    let result;

    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE availability
         SET status = $1
         WHERE user_id = $2 AND available_date = $3
         RETURNING *`,
        [status, userId, available_date]
      );
    } else {
      result = await pool.query(
        `INSERT INTO availability (user_id, available_date, status)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, available_date, status]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE AVAILABILITY ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAvailability = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name AS user_name
       FROM availability a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.available_date ASC, u.name ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('GET AVAILABILITY ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `DELETE FROM availability
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [availabilityId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Availability entry not found.' });
    }

    res.json({ message: 'Availability entry deleted successfully.' });
  } catch (error) {
    console.error('DELETE AVAILABILITY ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  deleteAvailability
};
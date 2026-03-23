const pool = require('../db/db');

const createTask = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, completed, assigned_user_id } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (event_id, title, completed, assigned_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [eventId, title, completed ?? false, assigned_user_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE TASK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTasksByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await pool.query(
      `SELECT t.*, u.name AS assigned_user_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_user_id = u.id
       WHERE t.event_id = $1
       ORDER BY t.created_at ASC`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('GET TASKS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, completed, assigned_user_id } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed),
           assigned_user_id = COALESCE($3, assigned_user_id)
       WHERE id = $4
       RETURNING *`,
      [title ?? null, completed ?? null, assigned_user_id ?? null, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('UPDATE TASK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING *`,
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('DELETE TASK ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByEvent,
  updateTask,
  deleteTask
};
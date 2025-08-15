// server.js
const express = require('express');
const cors = require('cors');
//const router = express.Router();
require('dotenv').config();

const db = require('./db'); // this is your pool from db.js

const app = express();
const PORT = process.env.PORT || 5000; // use a web port, not MySQL port

// middleware
app.use(cors());
app.use(express.json());

// sanity check endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

// --- AUTH ROUTES ---

// POST /api/register  -> create a new user
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request.' });
  }
  if (!username) return res.status(400).json({ error: 'Missing username.' });
  if (!password) return res.status(400).json({ error: 'Missing password.' });

  // Check if username already exists
  const checkSql = 'SELECT user_id FROM users WHERE username = ? LIMIT 1';
  db.query(checkSql, [username], (checkErr, checkRows) => {
    if (checkErr) return res.status(500).json({ error: 'Server error.' });

    if (checkRows.length > 0) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // Insert the new user (plain-text for now)
    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertSql, [username, password], (insErr, result) => {
      if (insErr) return res.status(500).json({ error: 'Server error.' });

      return res.status(201).json({
        message: 'Registration successful!',
        userId: result.insertId,
        username
      });
    });
  });
});

// POST /api/login  -> authenticate existing user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Guard rails
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request.' });
  }
  if (!username) return res.status(400).json({ error: 'Missing username.' });
  if (!password) return res.status(400).json({ error: 'Missing password.' });

  // Look up user
  const sql = 'SELECT user_id, username, password FROM users WHERE username = ? LIMIT 1';
  db.query(sql, [username], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error.' });

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = rows[0];

    // Plain-text compare (replace with bcrypt.compare later)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      userId: user.user_id,
      username: user.username
    });
  });
});

// --- USER ROUTES ---
// route to get user info by ID
// GET /user/:id
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT username FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) throw err;
    res.json(result[0]); // e.g., { username: "alice" }
  });
});

// fetch routines for a user
// GET /routines?user_id=123
// Returns all routines for a specific user, ordered by routine_id
app.get('/routines', (req, res) => {
  const userId = parseInt(req.query.user_id, 10);

  if (!userId) {
    return res.status(400).json({ error: 'Missing or invalid user_id.' });
  }

  const sql = `
    SELECT routine_id, user_id, routine_name, routine_duration_minutes
    FROM routines
    WHERE user_id = ?
    ORDER BY routine_id ASC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('DB error (/routines):', err.message);
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.status(200).json({ routines: rows });
  });
});

// GET /routine-player?routine_id=123
app.get('/routine-player', (req, res) => {
  const { routine_id } = req.query;

  // 1) Basic validation
  if (!routine_id || isNaN(Number(routine_id))) {
    return res.status(400).json({ error: 'Missing or invalid routine_id' });
  }

  // 2) Fetch routine
  const routineSql = `
    SELECT routine_id, user_id, routine_name, routine_duration_minutes, num_of_tasks
    FROM routines
    WHERE routine_id = ?
  `;
  db.query(routineSql, [routine_id], (err, routineRows) => {
    if (err) {
      console.error('DB error (routine):', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (routineRows.length === 0) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    const routine = routineRows[0];

    // 3) Fetch tasks for the routine (ordered)
    const tasksSql = `
      SELECT task_id, task_text, task_time, task_order
      FROM tasks
      WHERE routine_id = ?
      ORDER BY task_order ASC
    `;
    db.query(tasksSql, [routine_id], (err2, taskRows) => {
      if (err2) {
        console.error('DB error (tasks):', err2);
        return res.status(500).json({ error: 'Database error' });
      }

      // 4) Success response
      return res.status(200).json({
        routine,
        tasks: taskRows, // [{ task_id, task_text, task_time, task_order }, ...]
      });
    });
  });
});

// AddRoutine endpoint
// POST /add-routine (create routine + tasks)
app.post('/add-routine', (req, res) => {
  // pull these properties out of the object
  const { user_id, routine_name, routine_duration_minutes, tasks } = req.body;

  // validate user_id
  if (!user_id || isNaN(Number(user_id)) || user_id <= 0) {
    return res.status(400).json({ error: 'Missing or invalid user_id.' });
  }
  // validate routine_name
  if (!routine_name || !routine_name.trim()) {
    return res.status(400).json({ error: 'routine_name is required' });
  }
  // validate routine_duration_minutes
  const mins = Number(routine_duration_minutes);
  if (!Number.isInteger(mins) || mins < 0 || mins > 1440) {
    return res.status(400).json({ error: 'routine_duration_minutes must be 0..1440' });
  }
  // validate tasks
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'tasks must be a non-empty array' });
  }

  // 1) Insert the routine first
  const insertRoutineSql = `
    INSERT INTO routines (user_id, routine_name, routine_duration_minutes, num_of_tasks)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    insertRoutineSql,
    [Number(user_id), routine_name.trim(), mins, tasks.length],
    (rErr, rResult) => {
      if (rErr) {
        console.error('Insert routine error:', rErr);
        return res.status(500).json({ error: 'Failed to insert routine' });
      }
      const routine_id = rResult.insertId;

      // 2) Insert the tasks for the routine
      // .map loops through each task in the array of tasks
      // and creates an array of values to insert into the database
      const values = tasks.map((task, index) => {
        // task = current task object, index = position in the array
        // ensure task has the required properties
        const text = String(task?.task_text || '').trim(); // ensure task_text is a string
        const time = Number(task?.task_time); // ensure task_time is a number
        const rawOrder = task?.task_order ?? (index + 1); // default order is index + 1
        const order = Number(rawOrder); // ensure task_order is a number
        // validate task properties
        // if any of these are invalid, return null to skip this task
        if (!text ||
            !Number.isInteger(time) || time < 1 || time > 1440 ||
            !Number.isInteger(order) || order < 1) {
          return null;
        }
        // return an array of values to insert
        return [routine_id, text, time, order];
      });
      // filter out any null values (invalid tasks)
      if (values.includes(null)) {
        return res.status(400).json({ error: 'Invalid task data' });
      }

      const insertTaskSql = `
        INSERT INTO tasks (routine_id, task_text, task_time, task_order)
        VALUES ?
      `;
      db.query(insertTaskSql, [values], (sErr) => {
        if (sErr) {
          console.error('Insert tasks error:', sErr);
          return res.status(500).json({ error: 'Failed to insert tasks' });
        }
        return res.status(201).json({
          message: 'Routine created',
          routine_id,
          tasks_created: values.length
        });
      });
    }
  );
});

// EditRoutine endpoints
/* GET /routines/:id/edit-data
   Returns routine and tasks for editing
   GET /routines/:id/edit-data  -> { routine, tasks[] }
*/
app.get('/routines/:id/edit-data', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid routine id.' });
  }

  const routineSql = `
    SELECT routine_id, user_id, routine_name, routine_duration_minutes, num_of_tasks
    FROM routines
    WHERE routine_id = ?
  `;
  db.query(routineSql, [id], (err, rRows) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (rRows.length === 0) return res.status(404).json({ error: 'Routine not found.' });

    const tasksSql = `
      SELECT task_id, routine_id, task_text, task_time, task_order
      FROM tasks
      WHERE routine_id = ?
      ORDER BY task_order ASC, task_id ASC
    `;
    db.query(tasksSql, [id], (err2, tRows) => {
      if (err2) return res.status(500).json({ error: 'Database error.' });
      return res.status(200).json({ routine: rRows[0], tasks: tRows });
    });
  });
});


// PUT /edit-routine/:routine_id
app.put('/routines/:id', (req,res) => {
  const routineId = parseInt(req.params.id, 10);
  const { routine_name, routine_duration_minutes } = req.body || {};

  // Validate routine_id
  if (!Number.isInteger(routineId) || routineId <= 0) {
    return res.status(400).json({ error: 'Invalid routine id.' });
  }
  // Validate routine_name
  if (!routine_name || routine_name.trim() === '') {
    return res.status(400).json({ error: 'routine_name is required.' });
  }
  // Validate routine_duration_minutes
  const duration = Number(routine_duration_minutes);
  if (!Number.isInteger(duration) || duration < 0 || duration > 1440) {
    return res.status(400).json({
      error: 'routine_duration_minutes must be an integer between 0 and 1440.'
    });
  }

  /* Update routine info
     create the SQL string for updating the routine
     uses ? placeholders for the values
  */
  const updateRoutineSql = `
    UPDATE routines
    SET routine_name = ?, routine_duration_minutes = ?
    WHERE routine_id = ?
  `;
  // Execute the update query
  db.query(updateRoutineSql, [routine_name.trim(), duration, routineId], (err, result) => {
    if (err) {
      console.error('Error updating routine:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    // If no rows were affected, the routine was not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Routine not found.' });
    }

    // Fetch updated row
    const fetchUpdatedSql = `
      SELECT routine_id, user_id, routine_name, routine_duration_minutes, num_of_tasks
      FROM routines
      WHERE routine_id = ?
    `;
    // Execute the fetch query to get the updated routine
    db.query(fetchUpdatedSql, [routineId], (err2, rows) => {
      if (err2) {
        console.error('Error fetching updated routine:', err2);
        return res.status(500).json({ error: 'Database error.' });
      }
      return res.status(200).json({ routine: rows[0] });
    });
  });
});

// DELETE routine endpoint /routines/:id
app.delete('/routines/:id', (req, res) => {
  const routineId = parseInt(req.params.id, 10);

  // Validate routine_id
  if (!Number.isInteger(routineId) || routineId <= 0) {
    return res.status(400).json({ error: 'Invalid routine id.' });
  }
  // Create the SQL string for deleting the routine
  const sql = 'DELETE FROM routines WHERE routine_id = ?';
  // Execute the delete query
  db.query(sql, [routineId], (err, result) => {
    if (err) {
      console.error('Error deleting routine:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Routine not found.' });
    }
    // Success, nothing to return
    return res.status(204).send();
  });
});

// Editing tasks within a routine

// PUT /tasks/:task_id  — update task text and/or time (not order)
app.put('/tasks/:task_id', (req, res) => {
  // Validate task_id
  // the task_id should be a positive integer
  const taskId = parseInt(req.params.task_id, 10);
  // pull task_text and task_time from the request body
  // these are the properties we want to update
  const { task_text, task_time } = req.body || {};
  // Validate task_id
  // if task_id is not a number, or less than or equal to 0, return an error
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: 'Invalid task id.' });
  }
  // Set up the SQL update statement
  // 
  const updates = [];
  const params = [];

  if (typeof task_text === 'string') {
    const txt = task_text.trim();
    if (txt.length === 0) {
      return res.status(400).json({ error: 'task_text cannot be empty.' });
    }
    updates.push('task_text = ?');
    params.push(txt);
  }

  if (task_time !== undefined) {
    const t = Number(task_time);
    if (!Number.isInteger(t) || t < 1 || t > 1440) {
      return res.status(400).json({ error: 'task_time must be an integer between 1 and 1440.' });
    }
    updates.push('task_time = ?');
    params.push(t);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Provide task_text and/or task_time to update.' });
  }

  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE task_id = ?`;
  params.push(taskId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // return the updated row
    db.query(
      `SELECT task_id, routine_id, task_text, task_time, task_order
       FROM tasks WHERE task_id = ?`,
      [taskId],
      (err2, rows) => {
        if (err2) {
          console.error('Error fetching updated task:', err2);
          return res.status(500).json({ error: 'Database error.' });
        }
        return res.status(200).json({ task: rows[0] });
      }
    );
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
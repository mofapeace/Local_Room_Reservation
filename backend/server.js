const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'db', // matches the docker-compose service name
  user: 'root',
  password: 'rootpassword',
  database: 'room_booking'
});

// GET all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resources');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new booking
app.post('/api/bookings', async (req, res) => {
  const { resource_id, user_email, start_time, end_time } = req.body;
  try {
    await pool.query(
      'INSERT INTO bookings (resource_id, user_email, start_time, end_time) VALUES (?, ?, ?, ?)',
      [resource_id, user_email, start_time, end_time]
    );
    res.json({ message: 'Booking secured! W!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Backend is cooking on port 3000 🔥'));
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'rootpassword', // Make sure this matches your docker-compose.yml!
  database: 'room_booking'
});

// 🔥 MIDDLEWARE: The Bouncer
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // If there's no token, instantly reject them
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Big yikes, missing token' });
  }
  
  // If they have a token, let them through!
  next();
};

// Protect the route by adding `requireAuth` in the middle
app.get('/api/rooms', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resources');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Backend live and secured on 3000 🚀'));

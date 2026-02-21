const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { verifyToken, authorizeRoles } = require('./middleware/auth.middleware');
const app = express();
app.use(cors());
app.use(express.json());

const menuRoutes = require('./routes/menu.route');

app.use('/api/menu', menuRoutes);
const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Restaurant Management Backend Running');
});
const db = require('./config/db');


app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'You accessed a protected route',
    user: req.user
  });
});

app.get('/test-db', (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


module.exports = app;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL MENU ITEMS
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      menu_items.id,
      menu_items.name,
      menu_items.price,
      categories.name AS category
    FROM menu_items
    LEFT JOIN categories ON menu_items.category_id = categories.id
    WHERE menu_items.is_available = true
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
GET menu items by category
URL: /api/menuitems/:category
*/
router.get("/:category", (req, res) => {
  const { category } = req.params;

  let sql = "";
  let params = [];

  // 🔥 MAIN COURSE (veg + non-veg)
  if (category === "main") {
    sql = `
      SELECT * FROM menuitems
      WHERE category IN ('main_veg', 'main_nonveg')
      AND is_available = 1
    `;
  } 
  // 🔥 ALL OTHER CATEGORIES
  else {
    sql = `
      SELECT * FROM menuitems
      WHERE category = ?
      AND is_available = 1
    `;
    params = [category];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;

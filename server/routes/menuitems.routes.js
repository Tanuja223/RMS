const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:category", async (req, res) => {
  const { category } = req.params;

  let sql = "";
  let params = [];

  if (category === "main") {
    sql = `
      SELECT * FROM menuitems
      WHERE category IN ('main_veg', 'main_nonveg')
      AND is_available = 1
    `;
  } else {
    sql = `
      SELECT * FROM menuitems
      WHERE category = ?
      AND is_available = 1
    `;
    params = [category];
  }

  try {
    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
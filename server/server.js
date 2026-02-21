const express = require("express");
const cors = require("cors");
require("dotenv").config();
const orderRoutes = require("./routes/order.routes");
const app = express();
const cron = require("node-cron");
const db = require("./config/db");

// run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await db.query(`
      DELETE FROM orders
      WHERE status = 'paid'
      AND paid_at <= NOW() - INTERVAL 7 DAY
    `);

    console.log("Deleted old paid orders");
  } catch (err) {
    console.error(err);
  }
});


/* 🔥 ENABLE CORS */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

const menuRoutes = require("./routes/menuitems.routes");

/* ROUTES */
app.use("/api/menuitems", menuRoutes);

app.use("/api/orders", orderRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant Backend Running");
});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

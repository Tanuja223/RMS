const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");

const orderRoutes = require("./routes/order.routes");
const menuRoutes = require("./routes/menuitems.routes");
const authRoutes = require("./routes/auth.routes");
const db = require("./config/db");

const app = express();

// ✅ CORS (only once)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://rms-bice.vercel.app"
  ]
}));

// JSON middleware
app.use(express.json());

// Routes
app.use("/api/menuitems", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant Backend Running");
});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
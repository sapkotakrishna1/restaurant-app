require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
  res.send("Restaurant API is running");
});

// Food routes
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/orders",
  orderRoutes
);

app.use("/api/categories", categoryRoutes);


// Test database connection
pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
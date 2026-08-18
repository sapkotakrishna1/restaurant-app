require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const foodRoutes = require("./routes/foodRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.send("Restaurant API is running");
});

// ================================
// ROUTES
// ================================

app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// ================================
// CREATE DATABASE TABLES
// ================================

async function createTables() {
  try {
    console.log("Creating database tables...");

    // USERS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // CATEGORIES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // FOODS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS foods (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        CONSTRAINT fk_food_category
          FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE RESTRICT
      );
    `);

    // ORDERS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total NUMERIC(10,2) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_order_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    // ORDER ITEMS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        food_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        CONSTRAINT fk_order_item_order
          FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_order_item_food
          FOREIGN KEY (food_id)
          REFERENCES foods(id)
          ON DELETE RESTRICT
      );
    `);

    console.log("All database tables are ready.");

  } catch (error) {
    console.error("Database table creation failed:");
    console.error(error);
  }
}

// ================================
// START SERVER
// ================================

async function startServer() {
  try {

    // Test database connection
    const result = await pool.query("SELECT NOW()");

    console.log(
      "Database connected:",
      result.rows[0]
    );

    // Create tables
    await createTables();

    // Start server
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Database connection failed:"
    );

    console.error(error);

    process.exit(1);
  }
}

startServer();

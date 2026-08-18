const pool = require("../config/db");


// ======================================================
// GET ALL CATEGORIES
// ======================================================

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.description,
        c.status,
        c.created_at,
        c.updated_at,
        COUNT(f.id)::INTEGER AS foods
      FROM categories c

      LEFT JOIN foods f
        ON f.category_id = c.id

      GROUP BY
        c.id,
        c.name,
        c.description,
        c.status,
        c.created_at,
        c.updated_at

      ORDER BY c.id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};


// ======================================================
// GET SINGLE CATEGORY
// ======================================================

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.name,
        c.description,
        c.status,
        c.created_at,
        c.updated_at,
        COUNT(f.id)::INTEGER AS foods

      FROM categories c

      LEFT JOIN foods f
        ON f.category_id = c.id

      WHERE c.id = $1

      GROUP BY
        c.id,
        c.name,
        c.description,
        c.status,
        c.created_at,
        c.updated_at
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      message: "Failed to fetch category",
    });
  }
};


// ======================================================
// CREATE CATEGORY
// ======================================================

const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE LOWER(name) = LOWER($1)
      `,
      [name.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories
      (
        name,
        description,
        status
      )

      VALUES ($1, $2, $3)

      RETURNING
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      `,
      [
        name.trim(),
        description?.trim() || "",
        status || "Active",
      ]
    );

    // Return newly created category
    // with food count = 0
    const category = {
      ...result.rows[0],
      foods: 0,
    };

    res.status(201).json(category);

  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};


// ======================================================
// UPDATE CATEGORY
// ======================================================

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    // Check duplicate name
    const existing = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE LOWER(name) = LOWER($1)
      AND id != $2
      `,
      [
        name.trim(),
        id,
      ]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message:
          "Another category with this name already exists",
      });
    }

    // Update category
    const result = await pool.query(
      `
      UPDATE categories

      SET
        name = $1,
        description = $2,
        status = $3,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $4

      RETURNING
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      `,
      [
        name.trim(),
        description?.trim() || "",
        status || "Active",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Get food count
    const foodCount = await pool.query(
      `
      SELECT COUNT(*)::INTEGER AS foods
      FROM foods
      WHERE category_id = $1
      `,
      [id]
    );

    const category = {
      ...result.rows[0],
      foods: foodCount.rows[0].foods,
    };

    res.json(category);

  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    res.status(500).json({
      message: "Failed to update category",
    });
  }
};


// ======================================================
// DELETE CATEGORY
// ======================================================

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether foods are using this category
    const foodCheck = await pool.query(
      `
      SELECT COUNT(*)::INTEGER AS foods
      FROM foods
      WHERE category_id = $1
      `,
      [id]
    );

    const foodCount =
      foodCheck.rows[0].foods;

    // Don't delete category if foods exist
    if (foodCount > 0) {
      return res.status(400).json({
        message:
          `Cannot delete this category because ${foodCount} food(s) are using it.`,
      });
    }

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message:
        "Category deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
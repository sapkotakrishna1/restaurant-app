const pool = require("../config/db");

// =====================================================
// GET ALL FOODS
// =====================================================

async function getFoods(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        f.id,
        f.name,
        f.price,
        f.description,
        f.image,
        f.category_id,
        c.name AS category_name
      FROM foods f
      LEFT JOIN categories c
        ON f.category_id = c.id
      ORDER BY f.id
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching foods:", error);

    res.status(500).json({
      message: "Failed to fetch foods"
    });
  }
}


// =====================================================
// CREATE FOOD
// =====================================================

async function createFood(req, res) {
  try {

    const {
      name,
      price,
      description,
      image,
      category_id
    } = req.body;


    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !price || !description || !image) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!category_id) {
      return res.status(400).json({
        message: "Category is required"
      });
    }


    // -----------------------------
    // Check category exists
    // -----------------------------

    const category = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE id = $1
      `,
      [category_id]
    );

    if (category.rows.length === 0) {
      return res.status(400).json({
        message: "Selected category does not exist"
      });
    }


    // -----------------------------
    // Insert food
    // -----------------------------

    const result = await pool.query(
      `
      INSERT INTO foods
      (
        name,
        price,
        description,
        image,
        category_id
      )
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        name.trim(),
        price,
        description.trim(),
        image.trim(),
        category_id
      ]
    );


    res.status(201).json({
      message: "Food created successfully",
      food: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Error creating food:",
      error
    );

    res.status(500).json({
      message: "Failed to create food"
    });
  }
}


// =====================================================
// UPDATE FOOD
// =====================================================

const updateFood = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      price,
      description,
      image,
      category_id
    } = req.body;


    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !name ||
      price === undefined ||
      !description ||
      !image
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    if (!category_id) {
      return res.status(400).json({
        message: "Category is required"
      });
    }


    // -----------------------------
    // Check category
    // -----------------------------

    const category = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE id = $1
      `,
      [category_id]
    );

    if (category.rows.length === 0) {
      return res.status(400).json({
        message: "Selected category does not exist"
      });
    }


    // -----------------------------
    // Update food
    // -----------------------------

    const result = await pool.query(
      `
      UPDATE foods
      SET
        name = $1,
        price = $2,
        description = $3,
        image = $4,
        category_id = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        name.trim(),
        price,
        description.trim(),
        image.trim(),
        category_id,
        id
      ]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Food not found"
      });
    }


    res.status(200).json({
      message: "Food updated successfully",
      food: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Update food error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// DELETE FOOD
// =====================================================

const deleteFood = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM foods
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Food not found"
      });
    }


    res.status(200).json({
      message: "Food deleted successfully",
      food: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Delete food error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getFoods,
  createFood,
  updateFood,
  deleteFood
};
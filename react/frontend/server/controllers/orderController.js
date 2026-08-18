const pool = require("../config/db");


// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res) => {

  const client = await pool.connect();

  try {

    const { items } = req.body;


    // Check cart

    if (!items || items.length === 0) {

      return res.status(400).json({
        message: "Cart is empty"
      });

    }


    await client.query("BEGIN");


    let total = 0;


    // =========================
    // CHECK FOODS
    // =========================

    for (const item of items) {

      const result = await client.query(
        "SELECT * FROM foods WHERE id = $1",
        [item.foodId]
      );


      if (result.rows.length === 0) {

        throw new Error(
          `Food ${item.foodId} not found`
        );

      }


      const food = result.rows[0];


      total +=
        Number(food.price) *
        Number(item.quantity);

    }


    // =========================
    // CREATE ORDER
    // =========================

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (user_id, total, status)

      VALUES
      ($1, $2, $3)

      RETURNING *
      `,
      [
        req.user.id,
        total,
        "pending"
      ]
    );


    const order = orderResult.rows[0];


    // =========================
    // CREATE ORDER ITEMS
    // =========================

    for (const item of items) {

      const foodResult = await client.query(
        "SELECT * FROM foods WHERE id = $1",
        [item.foodId]
      );


      const food = foodResult.rows[0];


      await client.query(
        `
        INSERT INTO order_items
        (order_id, food_id, quantity, price)

        VALUES
        ($1, $2, $3, $4)
        `,
        [
          order.id,
          item.foodId,
          item.quantity,
          food.price
        ]
      );

    }


    await client.query("COMMIT");


    // =========================
    // SUCCESS
    // =========================

    res.status(201).json({

      message:
        "Order created successfully",

      order

    });


  } catch (error) {

    await client.query("ROLLBACK");


    console.error(
      "Create order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to create order"

    });


  } finally {

    client.release();

  }

};


const getMyOrders = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.total,
        o.status,
        o.created_at,

        COALESCE(
          json_agg(
            json_build_object(
              'foodId', oi.food_id,
              'name', f.name,
              'image', f.image,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      LEFT JOIN foods f
        ON oi.food_id = f.id

      WHERE o.user_id = $1

      GROUP BY
        o.id,
        o.total,
        o.status,
        o.created_at

      ORDER BY
        o.created_at DESC
      `,
      [req.user.id]
    );


    res.json(result.rows);


  } catch (error) {

    console.error(
      "Get my orders error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get orders"

    });

  }

};

// =========================
// GET ALL ORDERS
// ADMIN
// =========================

const getAllOrders = async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        o.total,
        o.status,
        o.created_at,

        u.name,
        u.email,

        COALESCE(
          json_agg(
            json_build_object(
              'foodId', oi.food_id,
              'name', f.name,
              'image', f.image,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      JOIN users u
        ON o.user_id = u.id

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      LEFT JOIN foods f
        ON oi.food_id = f.id

      GROUP BY
        o.id,
        u.name,
        u.email

      ORDER BY
        o.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      message: "Failed to get orders"
    });

  }

};


// =========================
// UPDATE ORDER STATUS
// ADMIN
// =========================

const updateOrderStatus = async (req, res) => {

  try {

    const { id } = req.params;

const { status } = req.body || {};

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered"
    ];

    if (!allowedStatuses.includes(status)) {

      return res.status(400).json({
        message: "Invalid order status"
      });

    }

    const result = await pool.query(
      `
      UPDATE orders

      SET status = $1

      WHERE id = $2

      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    res.json({
      message: "Order status updated",
      order: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update order status"
    });

  }

};

// =========================
// ADMIN DASHBOARD STATS
// =========================

const getDashboardStats = async (req, res) => {

  try {

    const ordersResult = await pool.query(
      "SELECT COUNT(*) AS total_orders FROM orders"
    );

    const customersResult = await pool.query(
      `
      SELECT COUNT(*) AS total_customers
      FROM users
      WHERE role = 'customer'
      `
    );

    const foodsResult = await pool.query(
      "SELECT COUNT(*) AS total_foods FROM foods"
    );

    const revenueResult = await pool.query(
      `
      SELECT COALESCE(SUM(total), 0) AS total_revenue
      FROM orders
      WHERE status != 'cancelled'
      `
    );


    res.json({

      totalOrders:
        Number(ordersResult.rows[0].total_orders),

      totalCustomers:
        Number(customersResult.rows[0].total_customers),

      totalFoods:
        Number(foodsResult.rows[0].total_foods),

      totalRevenue:
        Number(revenueResult.rows[0].total_revenue)

    });


  } catch (error) {

    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      message: "Failed to get dashboard statistics"
    });

  }

};

// =========================
// CANCEL MY ORDER
// =========================

const cancelMyOrder = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = $1
      AND user_id = $2
      AND status = 'pending'
      RETURNING *
      `,
      [
        id,
        req.user.id
      ]
    );


    if (result.rows.length === 0) {

      return res.status(400).json({
        message:
          "Order cannot be cancelled"
      });

    }


    res.json({

      message:
        "Order cancelled successfully",

      order:
        result.rows[0]

    });


  } catch (error) {

    console.error(
      "Cancel order error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to cancel order"

    });

  }

};




// =========================
// EXPORT
// =========================

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  cancelMyOrder
};
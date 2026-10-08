const db = require("../config/db");
const { sendOrderConfirmation } = require("../config/mailer");

// ===============================
// CREATE ORDER
// ===============================
const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { items, total_amount } = req.body;

    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    if (total_amount === undefined || total_amount === null) {
      return res.status(400).json({
        message: "Total amount is required",
      });
    }

    await connection.beginTransaction();

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES (?, ?, 'Pending')`,
      [user_id, total_amount]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const productId = item.product_id || item.id;

      console.log("ORDER ITEM:", item);
      console.log("PRODUCT ID:", productId);

      if (!productId) {
        throw new Error("Product ID is missing");
      }

      await connection.query(
        `INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [
          orderId,
          productId,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    // Get customer details
    const [users] = await db.query(
      `SELECT name, email
       FROM users
       WHERE id = ?`,
      [user_id]
    );

    // Send confirmation email
    if (users.length > 0 && users[0].email) {
      try {
        await sendOrderConfirmation({
          to: users[0].email,
          customerName: users[0].name,
          orderId,
          items,
          totalAmount: total_amount,
        });

        console.log(
          `Order confirmation email sent to ${users[0].email}`
        );

      } catch (emailError) {
        // Email failure should NOT cancel a successful order
        console.error(
          "Order email error:",
          emailError
        );
      }
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {
    await connection.rollback();

    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Failed to place order",
    });

  } finally {
    connection.release();
  }
};


// ===============================
// GET ALL ORDERS - ADMIN
// ===============================
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT
        o.id,
        o.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.total_amount,
        o.status,
        o.created_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.id DESC`
    );

    res.status(200).json(orders);

  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};


// ===============================
// UPDATE ORDER STATUS - ADMIN
// ===============================
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const [result] = await db.query(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};


// ===============================
// GET ORDER DETAILS
// ===============================
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // First get order
    const [orders] = await db.query(
      `SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at
       FROM orders o
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orders[0];

    // Admin can see any order.
    // Customer can only see their own order.
    if (
      req.user.role !== "admin" &&
      order.user_id !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    // Get products inside order
    const [items] = await db.query(
      `SELECT
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name,
        p.category,
        p.description,
        p.image
       FROM order_items oi
       JOIN products p
         ON oi.product_id = p.id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [id]
    );

    res.status(200).json({
      order,
      items,
    });

  } catch (error) {
    console.error("Get Order Details Error:", error);

    res.status(500).json({
      message: "Failed to fetch order details",
    });
  }
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
};
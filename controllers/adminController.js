const db = require("../config/db");

// ===============================
// ADMIN DASHBOARD STATS
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    // Total Products
    const [products] = await db.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );

    // Total Orders
    const [orders] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    // Total Customers
    const [customers] = await db.query(
      "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'"
    );

    // Pending Orders
    const [pending] = await db.query(
      "SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'Pending'"
    );

    // Total Sales
    const [sales] = await db.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS totalSales
       FROM orders
       WHERE status != 'Cancelled'`
    );

    // Recent Orders
    const [recentOrders] = await db.query(
      `SELECT
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS customer_name,
        u.email AS customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.id DESC
       LIMIT 5`
    );

    res.status(200).json({
      stats: {
        totalProducts: products[0].totalProducts,
        totalOrders: orders[0].totalOrders,
        totalCustomers: customers[0].totalCustomers,
        pendingOrders: pending[0].pendingOrders,
        totalSales: sales[0].totalSales,
      },
      recentOrders,
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
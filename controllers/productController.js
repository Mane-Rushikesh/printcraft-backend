const db = require("../config/db");

// ===============================
// GET ALL PRODUCTS
// ===============================
const getProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


// ===============================
// GET SINGLE PRODUCT
// ===============================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(products[0]);
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};


// ===============================
// CREATE PRODUCT - ADMIN
// ===============================
const createProduct = async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      price,
      image,
    } = req.body;

    if (!category || !name || price === undefined) {
      return res.status(400).json({
        message: "Category, name and price are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products
      (category, name, description, price, image)
      VALUES (?, ?, ?, ?, ?)`,
      [
        category,
        name,
        description || "",
        price,
        image || "",
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};


// ===============================
// UPDATE PRODUCT - ADMIN
// ===============================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category,
      name,
      description,
      price,
      image,
    } = req.body;

    if (!category || !name || price === undefined) {
      return res.status(400).json({
        message: "Category, name and price are required",
      });
    }

    const [result] = await db.query(
      `UPDATE products
       SET
         category = ?,
         name = ?,
         description = ?,
         price = ?,
         image = ?
       WHERE id = ?`,
      [
        category,
        name,
        description || "",
        price,
        image || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};


// ===============================
// DELETE PRODUCT - ADMIN
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
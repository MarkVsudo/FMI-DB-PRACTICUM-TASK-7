const express = require("express");
const router = express.Router();
const { query } = require("../db/connection");

// Products
router.get("/products", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM PRODUCTS");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Manufacturers
router.get("/manufacturers", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM Manufacturers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
router.get("/categories", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM Categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customers
router.get("/customers", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM Customers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  try {
    const rows = await query(`
      SELECT o.NUMBER, o.ORDER_DATE, o.STATUS, o.TOTAL_VALUE,
             c.FNAME, c.LNAME, c.EMAIL
      FROM Orders o
      JOIN Customers c ON o.CUSTEMAIL = c.EMAIL
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order items
router.get("/orders/:id/items", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID format" });
    }

    const rows = await query(
      `
      SELECT oi.ORDER_ITEM_ID, oi.QUANTITY, oi.UNIT_PRICE,
             p.NAME AS product, p.GRAMMAGE
      FROM Order_Items oi
      JOIN Products p ON oi.PRODNO = p.NUMBER
      WHERE oi.ORDERNO = ?
    `,
      [orderId],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;

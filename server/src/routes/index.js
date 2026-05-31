const express = require("express");
const router = express.Router();
const { query } = require("../db/connection");

// Products
router.get("/products", async (req, res) => {
  try {
    const rows = await query(`
  SELECT p.number, p.name, p.description, p.grammage, p.price, p.quantity,
         p.manname, p.catno, c.name AS category
  FROM Products p
  JOIN Categories c ON p.catno = c.number
`);
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

// POST /api/products
router.post("/products", async (req, res) => {
  const { name, description, grammage, price, quantity, manname, catno } =
    req.body;
  console.log("catno raw:", catno, "| as Number:", Number(catno));
  try {
    await query(
      `INSERT INTO Products (name, description, grammage, price, quantity, manname, catno)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        Number(grammage),
        Number(price),
        Number(quantity),
        manname,
        Number(catno),
      ],
    );
    res.status(201).json({ message: "Product created" });
  } catch (err) {
    console.error("INSERT failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id
router.put("/products/:id", async (req, res) => {
  const { name, description, grammage, price, quantity, manname, catno } =
    req.body;
  try {
    await query(
      `UPDATE Products SET name=?, description=?, grammage=?, price=?, quantity=?, manname=?, catno=?
       WHERE number=?`,
      [
        name,
        description,
        Number(grammage),
        Number(price),
        Number(quantity),
        manname,
        Number(catno),
        Number(req.params.id),
      ],
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete("/products/:id", async (req, res) => {
  try {
    await query("DELETE FROM Products WHERE number=?", [Number(req.params.id)]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/debug-products-cols", async (req, res) => {
  const rows = await query("SELECT * FROM Products FETCH FIRST 1 ROWS ONLY");
  res.json(rows);
});
module.exports = router;

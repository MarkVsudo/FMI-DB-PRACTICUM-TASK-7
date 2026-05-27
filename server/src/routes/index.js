const express = require("express");
const router = express.Router();
const { query } = require("../db/connection");

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Example DB route — swap with your actual table
router.get("/test-db", async (req, res) => {
  try {
    const result = await query("SELECT 1 FROM SYSIBM.SYSDUMMY1");
    res.json({ connected: true, result });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

module.exports = router;

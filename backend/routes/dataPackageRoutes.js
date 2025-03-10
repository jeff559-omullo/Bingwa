const express = require("express");
const DataPackage = require("../models/DataPackage");

const router = express.Router();

// Get all data packages
router.get("/", async (req, res) => {
  try {
    const packages = await DataPackage.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
